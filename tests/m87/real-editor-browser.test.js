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
 page.on('response', response=>{ if(response.status()>=400) browserErrors.push('http '+response.status()+': '+response.url()); });
 await page.goto('http://127.0.0.1:'+address.port+'/tests/browser/editor-runtime-flow.html');
 try { await page.waitForFunction(()=>window.editorRuntimeTestReady===true || window.editorRuntimeLoadError,{timeout:10000}); }
 catch(error){ throw new Error('Editor runtime did not become ready. Browser diagnostics: '+JSON.stringify(browserErrors)+'; loadError: '+String(await page.evaluate(()=>window.editorRuntimeLoadError||''))+'; timeout: '+String(error?.message||error)); }
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
