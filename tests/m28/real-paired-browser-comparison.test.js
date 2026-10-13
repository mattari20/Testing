import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { listNativeV2Templates } from '../../src/templates/v2-native-template-catalog.js';
import { runPairedBrowserComparison } from '../../src/validation/paired-browser-comparison.js';
import { createPlaywrightPageFactory, createPlaywrightRawPageFactory } from '../../src/render/playwright-page-adapter.js';
import { createRepresentativeCareerSnapshot } from '../fixtures/representative-career-document-v1.js';

const projectRoot=process.cwd();
const server=createServer((request,response)=>{
 const pathname=decodeURIComponent(new URL(request.url||'/', 'http://127.0.0.1').pathname);
 const file=path.resolve(projectRoot, '.'+pathname);
 if(file!==projectRoot&&!file.startsWith(projectRoot+path.sep)){response.writeHead(403);response.end('Forbidden');return;}
 try{
  if(pathname==='/'){response.writeHead(200,{'content-type':'text/html; charset=utf-8'});response.end('<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>');return;}
  const body=fs.readFileSync(file),ext=path.extname(file);
  const contentType=ext==='.js'?'text/javascript; charset=utf-8':ext==='.html'?'text/html; charset=utf-8':ext==='.css'?'text/css; charset=utf-8':'application/octet-stream';
  response.writeHead(200,{'content-type':contentType});response.end(body);
 }catch{response.writeHead(404);response.end('Not found');}
});
await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
const baseUrl='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true});
try {
 const result=await runPairedBrowserComparison({
  templates:listNativeV2Templates(),snapshot:createRepresentativeCareerSnapshot(),artifactDir:'artifacts/m28',
  sourceLoader:async sourcePath=>{
   const requestPath=sourcePath.startsWith('/')?sourcePath.slice(1):sourcePath;
   const response=await fetch(new URL(requestPath,baseUrl+'/'));
   if(!response.ok)throw new Error('Template source request failed: '+response.status+' '+sourcePath);
   return response.text();
  },
  nativePageFactory:createPlaywrightPageFactory(browser,{baseUrl}),
  v1PageFactory:createPlaywrightRawPageFactory(browser)
 });
 assert.equal(result.templateCount,7);
 assert.ok(result.results.every(x=>x.v1.renderStatus==='ready'&&x.v2.renderStatus==='ready'));
 assert.ok(result.results.every(x=>x.v1.screenshotArtifact&&x.v2.screenshotArtifact));
 assert.ok(result.results.every(x=>x.pairedEvidence.visualEquivalenceStatus==='insufficient-evidence'));
 console.log(`M28 paired comparison validated ${result.results.length} template pair(s).`);
} finally { await browser.close(); await new Promise(resolve=>server.close(resolve)); }
console.log('M28 real paired V1/V2 browser comparison completed.');