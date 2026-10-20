/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS test harness. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { NextRequest } = require('next/server');
function load(file, imports = {}) {
 const mod={exports:{}};
 const js=ts.transpileModule(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),{fileName:file,compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText;
 new Function('require','exports','module',js)(name=>Object.hasOwn(imports,name)?imports[name]:require(name),mod.exports,mod);
 return mod.exports;
}
test('verification routing isolates shopping and retains existing QR fallback',()=>{
 const {proxy}=load('proxy.ts');const saved=process.env.VERIFICATION_SITE_URL;
 try {
 delete process.env.VERIFICATION_SITE_URL;
 const call=(url,method='GET')=>proxy(new NextRequest(url,{method}));
 assert.equal(call('https://bridgecarepharmang.com/verify').headers.get('x-middleware-next'),'1');
 assert(proxy(new NextRequest('http://localhost/',{headers:{host:'verify.bridgecarepharmang.com'}})).headers.get('x-middleware-rewrite'));
 assert.equal(call('https://verify.bridgecarepharmang.com/').headers.get('x-middleware-rewrite'),'https://verify.bridgecarepharmang.com/verify');
 for(const p of ['/products','/cart','/admin','/contact','/verify?code=SECRET']) assert.equal(call('https://verify.bridgecarepharmang.com'+p).headers.get('location'),'https://verify.bridgecarepharmang.com/');
 assert.equal(call('https://verify.bridgecarepharmang.com/api/verify','POST').headers.get('x-middleware-next'),'1');
 assert.equal(call('https://verify.bridgecarepharmang.com/api/admin/login','POST').status,404);
 process.env.VERIFICATION_SITE_URL='https://verify.bridgecarepharmang.com';
 assert.equal(call('https://bridgecarepharmang.com/verify?code=SECRET').headers.get('location'),'https://verify.bridgecarepharmang.com/');
 assert.equal(call('https://bridgecarepharmang.com/products').headers.get('x-middleware-next'),'1');
 process.env.VERIFICATION_SITE_URL='https://unrelated.example';
 assert.equal(call('https://bridgecarepharmang.com/verify').headers.get('x-middleware-next'),'1');
 } finally {if(saved===undefined)delete process.env.VERIFICATION_SITE_URL;else process.env.VERIFICATION_SITE_URL=saved;}
});
test('verification markup has support and code entry without store links',()=>{
 const client=load('app/verify/VerifyClient.tsx').VerifyClient;
 const page=load('app/verify/page.tsx',{'./VerifyClient':{VerifyClient:client}}).default;
 const markup=renderToStaticMarkup(React.createElement(page));
 assert(markup.includes('Security code'));assert(markup.includes('tel:+2348077733373'));
 assert(!/href="\/(products|cart|checkout|contact)/.test(markup));
 assert(!markup.includes('₦'));assert(!markup.includes('Shop online'));
});
