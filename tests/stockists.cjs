/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS integration-test harness. */
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {randomUUID}=require('node:crypto');
const ts=require('typescript');
const {PGlite}=require('@electric-sql/pglite');
const root=path.resolve(__dirname,'..');
function load(file,imports={}){const target={exports:{}};const output=ts.transpileModule(fs.readFileSync(path.join(root,file),'utf8'),{fileName:file,compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText;new Function('require','exports','module',output)(name=>Object.hasOwn(imports,name)?imports[name]:require(name),target.exports,target);return target.exports;}
const catalogue=load('data/products.ts');const utils=load('lib/stockists.ts',{'@/data/products':catalogue});
const fixture={name:'QA Example Pharmacy',address:'10 Test Street',city:'Jos',state:'Plateau',phone:'08012345678',whatsapp:'',productSlugs:[catalogue.PRODUCTS[0].slug],openingHours:'Mon–Sat, 8 am–6 pm',isActive:false};
test('validation, Nigerian states, public filtering and contact links',()=>{
 assert.equal(utils.NIGERIAN_STATES.length,37);
 const parsed=utils.stockistSchema.parse({...fixture,name:'  QA Example Pharmacy  '});assert.equal(parsed.name,'QA Example Pharmacy');assert.equal(parsed.isActive,false);
 for(const invalid of [{state:'Imaginary State'},{phone:'javascript:alert(1)'},{phone:'123'},{productSlugs:['not-a-product']},{isActive:'true'},{address:''}])assert(!utils.stockistSchema.safeParse({...fixture,...invalid}).success);
 assert.equal(utils.whatsappHref('08012345678'),'https://wa.me/2348012345678');assert.equal(utils.whatsappHref('+234 801 234 5678'),'https://wa.me/2348012345678');assert.equal(utils.phoneHref('+234 801 234 5678'),'tel:+2348012345678');
 const place={...fixture,address:'10 Test Road & Close #2'};const url=new URL(utils.directionsHref(place));assert.equal(url.origin,'https://www.google.com');assert.equal(url.searchParams.get('destination'),'10 Test Road & Close #2, Jos, Plateau, Nigeria');
 const shops=[{...fixture,id:'hidden'},{...fixture,id:'visible',isActive:true},{...fixture,id:'lagos',isActive:true,city:'Ikeja',state:'Lagos',name:'QA Lagos Store',productSlugs:[]}];
 assert.equal(utils.filterStockists(shops,'','','','').length,2);
 assert.deepEqual(utils.filterStockists(shops,'Plateau','Jos',fixture.productSlugs[0],'example').map(x=>x.id),['visible']);
 assert.equal(utils.filterStockists(shops,'Lagos','Jos','','').length,0);
 assert.equal(utils.filterStockists(shops,'','','','No matching pharmacy').length,0);
});
test('public UI renders useful empty state, limited results and safe links',()=>{
 const component=load('app/store-locations/StoreLocator.tsx',{'@/data/products':catalogue,'@/lib/stockists':utils}).StoreLocator;
 const React=require('react');const {renderToStaticMarkup}=require('react-dom/server');
 const empty=renderToStaticMarkup(React.createElement(component,{locations:[]}));assert(empty.includes('Our store directory is being updated'));assert(!empty.includes('QA Example Pharmacy'));
 const shops=Array.from({length:14},(_,i)=>({...fixture,id:String(i),isActive:true,name:`QA Example ${i}`}));
 const html=renderToStaticMarkup(React.createElement(component,{locations:shops}));assert.equal((html.match(/class="stockist-card"/g)||[]).length,12);assert(html.includes('Show more locations'));assert(html.includes('Call to confirm product availability'));assert(html.includes('All states'));
});
test('migration and authenticated transactional add/edit/hide/delete lifecycle',async()=>{
 const db=new PGlite();await db.exec(fs.readFileSync(path.join(root,'prisma/migrations/20261019090000_store_locations/migration.sql'),'utf8'));
 const rows=async(sql,params=[])=>(await db.query(sql,params)).rows;
 let failAudit=false,signedIn=true;
 function adapter(connection){const query=async(sql,params=[])=>(await connection.query(sql,params)).rows;return {
  stockist:{
   create:async({data:d})=>(await query('INSERT INTO "Stockist" ("id","name","address","city","state","phone","whatsapp","productSlugs","openingHours","isActive","updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,$8::text[],$9,$10,CURRENT_TIMESTAMP) RETURNING *',[randomUUID(),d.name,d.address,d.city,d.state,d.phone,d.whatsapp,d.productSlugs,d.openingHours,d.isActive]))[0],
   update:async({where:w,data:d})=>{const r=(await query('UPDATE "Stockist" SET "name"=$2,"address"=$3,"city"=$4,"state"=$5,"phone"=$6,"whatsapp"=$7,"productSlugs"=$8::text[],"openingHours"=$9,"isActive"=$10,"updatedAt"=CURRENT_TIMESTAMP WHERE "id"=$1 RETURNING *',[w.id,d.name,d.address,d.city,d.state,d.phone,d.whatsapp,d.productSlugs,d.openingHours,d.isActive]))[0];if(!r)throw Error('missing');return r;},
   delete:async({where:w})=>{const r=(await query('DELETE FROM "Stockist" WHERE "id"=$1 RETURNING *',[w.id]))[0];if(!r)throw Error('missing');return r;}
  },
  adminAuditLog:{create:async()=>{if(failAudit)throw Error('audit failure');return {};}}
 };}
 const prisma={$transaction:fn=>db.transaction(tx=>fn(adapter(tx)))};
 const route=load('app/api/admin/stockists/route.ts',{'@/lib/prisma':{prisma},'@/lib/admin-auth':{isAdminAuthenticated:async()=>signedIn},'@/lib/stockists':utils});
 const req=(body,origin='https://bridgecarepharmang.com')=>new Request('https://bridgecarepharmang.com/api/admin/stockists',{method:'POST',headers:{origin,'Content-Type':'application/json'},body:JSON.stringify(body)});
 signedIn=false;assert.equal((await route.POST(req({...fixture,action:'save'}))).status,401);signedIn=true;
 assert.equal((await route.POST(req({...fixture,action:'save'},'https://attacker.example'))).status,403);
 assert.equal((await route.POST(req({...fixture,action:'save',phone:'invalid'}))).status,400);
 const created=await route.POST(req({...fixture,action:'save'}));assert.equal(created.status,200);const {id}=await created.json();assert(id);assert.match(created.headers.get('cache-control'),/no-store/);
 assert.equal((await rows('SELECT * FROM "Stockist" WHERE "isActive"=true')).length,0);
 assert.equal((await route.POST(req({...fixture,action:'save',id,isActive:true}))).status,200);
 assert.equal((await rows('SELECT * FROM "Stockist" WHERE "isActive"=true')).length,1);
 assert.equal((await route.POST(req({...fixture,action:'save',id,name:'QA Updated Store',isActive:false}))).status,200);
 assert.equal((await rows('SELECT * FROM "Stockist" WHERE "isActive"=true')).length,0);assert.equal((await rows('SELECT * FROM "Stockist" WHERE "id"=$1',[id]))[0].name,'QA Updated Store');
 failAudit=true;assert.equal((await route.POST(req({...fixture,action:'save'}))).status,503);assert.equal((await rows('SELECT * FROM "Stockist"')).length,1);failAudit=false;
 assert.equal((await route.POST(req({action:'delete',id}))).status,200);assert.equal((await rows('SELECT * FROM "Stockist"')).length,0);
 assert.equal((await route.POST(req({action:'delete'}))).status,400);
 await db.close();
});

test('confirmed nationwide import is active, complete, repeatable and preserves admin edits',async()=>{
 const locations=JSON.parse(fs.readFileSync(path.join(root,'data/stockists-import.json'),'utf8'));
 assert.equal(new Set(locations.map(s=>s.state)).size,37);
 assert.equal(new Set(locations.map(s=>s.id)).size,locations.length);
 for(const shop of locations){assert.equal(shop.isActive,true);utils.stockistSchema.parse(shop);}
 const db=new PGlite();
 await db.exec(fs.readFileSync(path.join(root,'prisma/migrations/20261019090000_store_locations/migration.sql'),'utf8'));
 const sql=fs.readFileSync(path.join(root,'prisma/migrations/20261019150000_activate_confirmed_stockists/migration.sql'),'utf8');
 await db.exec(sql);
 assert.equal((await db.query('SELECT count(*)::int AS n FROM "Stockist" WHERE "isActive"=true')).rows[0].n,locations.length);
 await db.query('UPDATE "Stockist" SET "phone"=$1 WHERE "id"=$2',['08012345678',locations[0].id]);
 await db.exec(sql);
 assert.equal((await db.query('SELECT count(*)::int AS n FROM "Stockist"')).rows[0].n,locations.length);
 assert.equal((await db.query('SELECT "phone" FROM "Stockist" WHERE "id"=$1',[locations[0].id])).rows[0].phone,'08012345678');
 await db.close();
});
