import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { prepareStoreRoutes } from '../scripts/prepare-store-routes.mjs';

test('overlay duplicates are archived, custom/API/verify files stay, reruns are safe', () => {
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'bridgecare-routes-'));
 const write=(p,value)=>{const file=path.join(root,p);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,value);};
 try {
  for(const name of ['layout.tsx','page.tsx','about/page.tsx','admin/customers/page.tsx'])write(`app/(store)/${name}`,'canonical');
  for(const name of ['page.tsx','about/page.jsx','admin/customers/page.tsx'])write(`app/${name}`,'legacy with edits');
  for(const name of ['api/verify/route.ts','verify/page.tsx','custom/page.tsx','about/Widget.tsx'])write(`app/${name}`,'keep');
  const moved=prepareStoreRoutes(root);assert.equal(moved.length,3);
  for(const name of moved)assert(!fs.existsSync(path.join(root,name)));
  for(const name of ['api/verify/route.ts','verify/page.tsx','custom/page.tsx','about/Widget.tsx'])assert.equal(fs.readFileSync(path.join(root,'app',name),'utf8'),'keep');
  const files=fs.readdirSync(path.join(root,'.bridgecare-route-backup'),{recursive:true}).filter(x=>x.endsWith('.bak'));
  assert.equal(files.length,3);for(const file of files)assert.equal(fs.readFileSync(path.join(root,'.bridgecare-route-backup',file),'utf8'),'legacy with edits');
  assert.deepEqual(prepareStoreRoutes(root),[]);
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
test('incomplete upload stops before moving any legacy page',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'bridgecare-routes-'));
 try{fs.mkdirSync(path.join(root,'app'),{recursive:true});fs.writeFileSync(path.join(root,'app/page.tsx'),'keep');assert.throws(()=>prepareStoreRoutes(root),/incomplete/);assert.equal(fs.readFileSync(path.join(root,'app/page.tsx'),'utf8'),'keep');}finally{fs.rmSync(root,{recursive:true,force:true});}
});
