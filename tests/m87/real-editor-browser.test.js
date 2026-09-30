import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const server=createServer(async(req,res)=>{
 try{
  const clean=decodeURIComponent((req.url||'/').split('?')[0]);
  const file=clean==='/'?'/tests/browser/editor-runtime-m87.html':clean;
  const body=await readFile(path.join(root,file));
  const ext=path.extname(file);
  res.writeHead(200,{'Content-Type':ext==='.js'?'text/javascript':ext==='.html'?'text/html':'text/plain'});
  res.end(body);
 }catch(e){res.writeHead(404);res.end(String(e));}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const address=server.address();
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage();
 const browserErrors=[];
 page.on('pageerror', error=>browserErrors.push('pageerror: '+String(error?.stack||error?.message||error)));
 page.on('console', message=>{ if(message.type()==='error') browserErrors.push('console: '+message.text()); });
 page.on('response', response=>{ if(response.status()>=400) browserErrors.push('http '+response.status()+': '+response.url()); else if(response.request().resourceType()==='script') browserErrors.push('script '+response.status()+': '+response.url()); });
 await page.goto('http://127.0.0.1:'+address.port+'/tests/browser/editor-runtime-m87.html');
 const moduleProbe=['/src/ui/editor-runtime.js','/src/templates/native-template-source-loader.js','/src/ui/template-preview-mounter.js','/src/application/cv-application.js','/src/ui/template-preview-controller.js','/src/ui/editor-page-controller.js','/src/ui/editor-dom-controller.js','/src/ui/editor-form-renderer.js','/src/templates/v2-native-template-catalog.js','/src/core/career-document-core.js','/src/render/native-v2-template-renderer.js','/src/assembly/document-assembly-engine.js','/src/application/editor-command-contract.js','/src/core/document-lifecycle.js','/src/application/editor-surface.js','/src/application/editor-preview-controller.js','/src/templates/template-engine.js','/src/preview/preview-engine.js','/src/templates/presentation-variant-engine.js','/src/layout/layout-pagination-engine.js','/src/export/export-engine.js','/src/application/editor-session.js','/src/application/editor-command-executor.js','/src/templates/template-preview.js','/src/storage/local-first-session.js','/src/templates/template-library.js','/src/templates/template-onboarding.js'];
 const importDiagnostics=await page.evaluate(async urls=>{const out=[];for(const url of urls){try{await import(url);out.push({url,status:'ok'});}catch(error){out.push({url,status:'error',error:String(error?.stack||error?.message||error)});}}return out;},moduleProbe);
 try { await page.waitForFunction(()=>window.editorRuntimeTestReady===true || window.editorRuntimeLoadError,{timeout:10000}); }
 catch(error){ throw new Error('Editor runtime did not become ready. Browser diagnostics: '+JSON.stringify(browserErrors)+'; importDiagnostics: '+JSON.stringify(importDiagnostics)+'; loadError: '+String(await page.evaluate(()=>window.editorRuntimeLoadError||''))+'; timeout: '+String(error?.message||error)); }
 const loadError=await page.evaluate(()=>window.editorRuntimeLoadError||'');
 if(loadError) throw new Error('Editor runtime module import failed: '+loadError);
 const field=page.locator('[data-v2-editor-field="personal:name"]');
 await field.fill('Updated Browser User');
 await page.waitForFunction(()=>window.editorRuntime.surface.getState().session.application.masterProfile.careerData.sections[0].fields[0].value==='Updated Browser User');
 const state=await page.evaluate(()=>window.editorRuntime.surface.getState());
 assert.equal(state.session.application.masterProfile.careerData.sections[0].fields[0].value,'Updated Browser User');
 assert.ok(state.session.dirty);
 assert.ok(await page.locator('[data-v2-editor-field]').count()===1);
 const artifactDir=path.join(root,'artifacts/m87');
 await mkdir(artifactDir,{recursive:true});
 await page.screenshot({path:path.join(artifactDir,'editor-runtime.png'),fullPage:true});
 await writeFile(path.join(artifactDir,'editor-runtime-evidence.json'),JSON.stringify({
   version:'1.0.0',
   status:'partial',
   checks:{mount:'passed',fields:'passed',mutation:'passed',preview:'not-run',templateSwitch:'not-run'}
 },null,2));
 console.log(JSON.stringify({mount:'passed',fields:'passed',mutation:'passed',preview:'not-run',templateSwitch:'not-run'}));
}finally{await browser.close();server.close();}
