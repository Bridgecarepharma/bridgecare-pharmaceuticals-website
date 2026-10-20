/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS test harness transpiles route handlers. */
// Integration tests: actual route handlers + PostgreSQL-compatible PGlite.
// Prisma is adapted to SQL in this test; no live Supabase account is needed.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { randomUUID } = require('node:crypto');
const path = require('node:path');
const ts = require('typescript');
const { PGlite } = require('@electric-sql/pglite');
const root = path.resolve(__dirname, '..');
function load(file, imports) {
 const testModule = { exports: {} };
 const output = ts.transpileModule(readFileSync(path.join(root,file),'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText;
 new Function('require','exports','module',output)(name=>Object.hasOwn(imports,name)?imports[name]:require(name),testModule.exports,testModule);
 return testModule.exports;
}
const utils = load('lib/verification-codes.ts', {});
test('security codes: random, unique, normalized, hashed, safe CSV', () => {
 const codes = utils.generateSecurityCodes(5000);
 assert.equal(new Set(codes.map(x=>x.codeHash)).size,5000);
 for(const c of codes){assert.match(c.code,/^(?:[A-F0-9]{4}-){5}[A-F0-9]{4}$/);assert.equal(c.codeHash,utils.securityCodeHash(c.code.toLowerCase().replaceAll('-',' ')));assert(!c.codeHash.includes(c.code));}
 assert.throws(()=>utils.generateSecurityCodes(5001));assert.throws(()=>utils.generateSecurityCodes(0));
 assert.equal(utils.csvCell('=SUM(A1)'), '"\'=SUM(A1)"');assert.equal(utils.csvCell('a"b'),'"a""b"');
});
test('migration + admin lifecycle + public verification + repeat/rate-limit/error handling', async () => {
 const db = new PGlite();
 await db.exec(readFileSync(path.join(root,'prisma/migrations/20261015090000_pack_verification/migration.sql'),'utf8'));
 const rows = async(sql,params=[]) => (await db.query(sql,params)).rows;
 function adapter(connection) {
  const query = async(sql,params=[]) => (await connection.query(sql,params)).rows;
  const code = async id => { const r=(await query('SELECT * FROM "VerificationCode" WHERE "id"=$1',[id]))[0];if(!r)return null;r.batch=(await query('SELECT * FROM "VerificationBatch" WHERE "id"=$1',[r.batchId]))[0];return r; };
  return {
   $queryRaw:(strings,...values)=>query(strings.reduce((s,x,i)=>s+x+(i<values.length?'$'+(i+1):''),''),values),
   verificationBatch:{
    create:async({data:d})=>(await query('INSERT INTO "VerificationBatch" ("id","productSlug","productName","batchNumber","manufacturedAt","expiresAt") VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',[randomUUID(),d.productSlug,d.productName,d.batchNumber,d.manufacturedAt,d.expiresAt]))[0],
    findUniqueOrThrow:async({where:w})=>{const r=(await query('SELECT * FROM "VerificationBatch" WHERE "id"=$1',[w.id]))[0];if(!r)throw Error('missing');return r;},
    update:async({where:w,data:d})=>(await query('UPDATE "VerificationBatch" SET "active"=$2 WHERE "id"=$1 RETURNING *',[w.id,d.active]))[0]
   },
   verificationCode:{
    createMany:async({data})=>{for(const d of data)await query('INSERT INTO "VerificationCode" ("id","codeHash","batchId") VALUES ($1,$2,$3)',[randomUUID(),d.codeHash,d.batchId]);},
    findUnique:async({where:w})=>(await query('SELECT * FROM "VerificationCode" WHERE "codeHash"=$1',[w.codeHash]))[0]||null,
    findUniqueOrThrow:async({where:w})=>{const r=await code(w.id);if(!r)throw Error('missing');return r;},
    update:async({where:w,data:d})=>{
     if(d.disabled){const r=await query('UPDATE "VerificationCode" SET "disabled"=true WHERE "id"=$1 AND "batchId"=$2 RETURNING *',[w.id,w.batchId]);if(!r.length)throw Error('missing');return r[0];}
     return (await query('UPDATE "VerificationCode" SET "checks"="checks"+1,"firstCheckedAt"=$2,"lastCheckedAt"=$3 WHERE "id"=$1 RETURNING *',[w.id,d.firstCheckedAt,d.lastCheckedAt]))[0];
    }
   },
   verificationEvent:{create:async({data:d})=>(await query('INSERT INTO "VerificationEvent" ("id","codeId","outcome") VALUES ($1,$2,$3) RETURNING *',[randomUUID(),d.codeId||null,d.outcome]))[0]},
   adminAuditLog:{create:async()=>({})}
  };
 }
 const prisma={
  $transaction:fn=>db.transaction(tx=>fn(adapter(tx))),
  verificationLimit:{
   upsert:async({create:d})=>(await rows('INSERT INTO "VerificationLimit" ("key","expiresAt") VALUES ($1,$2) ON CONFLICT ("key") DO UPDATE SET "count"="VerificationLimit"."count"+1 RETURNING *',[d.key,d.expiresAt]))[0],
   deleteMany:async({where:w})=>rows('DELETE FROM "VerificationLimit" WHERE "expiresAt"<$1',[w.expiresAt.lt])
  }
 };
 let signedIn=true;
 const imports={'@/lib/prisma':{prisma},'@/lib/verification-codes':utils,'@/lib/admin-auth':{isAdminAuthenticated:async()=>signedIn}};
 const publicRoute=load('app/api/verify/route.ts',imports);const admin=load('app/api/admin/verification/route.ts',imports);
 process.env.DATABASE_URL='test';process.env.ADMIN_SESSION_SECRET='local-test-secret';
 const req=(data,ip='192.0.2.1',origin='https://bridgecarepharmang.com')=>new Request('https://bridgecarepharmang.com/api/admin/verification',{method:'POST',headers:{origin,'Content-Type':'application/json','x-nf-client-connection-ip':ip},body:JSON.stringify(data)});
 const verify=(code,ip)=>publicRoute.POST(req({code},ip));
 const create={action:'create',productSlug:'asfenositol',batchNumber:'QA-001',manufacturedAt:'2026-01-01',expiresAt:'2090-01-01',count:2};
 signedIn=false;assert.equal((await admin.POST(req(create))).status,401);signedIn=true;
 assert.equal((await admin.POST(req(create,undefined,'https://attacker.example'))).status,403);
 assert.equal((await admin.POST(req({...create,expiresAt:'2026-02-30'}))).status,400);
 const generated=await admin.POST(req(create));assert.equal(generated.status,200);assert.match(generated.headers.get('cache-control'),/no-store/);
 const csv=await generated.text();const securityCodes=[...csv.matchAll(/[A-F0-9]{4}(?:-[A-F0-9]{4}){5}/g)].map(x=>x[0]);assert.equal(securityCodes.length,2);
 const batch=(await rows('SELECT * FROM "VerificationBatch"'))[0];assert.equal(batch.active,false);
 assert.equal((await (await verify(securityCodes[0])).json()).status,'INACTIVE');
 assert.equal((await admin.POST(req({action:'activate',id:batch.id}))).status,200);
 const simultaneous=await Promise.all([verify(securityCodes[0],'192.0.2.2'),verify(securityCodes[0],'192.0.2.3')]);
 const statuses=await Promise.all(simultaneous.map(r=>r.json()));assert.deepEqual(statuses.map(x=>x.status).sort(),['PREVIOUSLY_CHECKED','RECOGNISED']);assert.deepEqual(statuses.map(x=>x.checkCount).sort(),[1,2]);for(const result of statuses){assert(!('batchNumber' in result));assert(!('manufacturedAt' in result));assert(!('expiresAt' in result));}
 const pack=(await rows('SELECT * FROM "VerificationCode" WHERE "codeHash"=$1',[utils.securityCodeHash(securityCodes[0])]))[0];assert.equal(pack.checks,2);assert(pack.firstCheckedAt);assert.equal(pack.codeHash.length,64);
 assert.equal((await admin.POST(req({action:'disable-code',id:batch.id,codeId:pack.id}))).status,200);
 assert.equal((await (await verify(securityCodes[0])).json()).status,'INACTIVE');
 assert.equal((await admin.POST(req({action:'deactivate',id:batch.id}))).status,200);
 assert.equal((await (await verify(securityCodes[1])).json()).status,'INACTIVE');
 await rows('UPDATE "VerificationBatch" SET "active"=true,"expiresAt"=$1 WHERE "id"=$2',[new Date('2020-01-01'),batch.id]);
 assert.equal((await (await verify(securityCodes[1])).json()).status,'EXPIRED');
 assert.equal((await admin.POST(req({action:'activate',id:batch.id}))).status,400);
 assert.equal((await (await verify('0000-0000-0000-0000-0000-0000')).json()).status,'UNRECOGNISED');
 assert.equal((await verify('short')).status,400);
 for(let i=0;i<30;i++)assert.equal((await verify('000000000000000000000000','192.0.2.50')).status,200);
 assert.equal((await verify('000000000000000000000000','192.0.2.50')).status,429);
 delete process.env.DATABASE_URL;assert.equal((await verify(securityCodes[0])).status,503);
 assert((await rows('SELECT * FROM "VerificationEvent" WHERE "outcome"=$1',['PREVIOUSLY_CHECKED'])).length>0);
 await db.close();
});
