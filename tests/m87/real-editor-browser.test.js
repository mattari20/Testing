import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const server=createServer(async(req,res)=>{
 try{
  const clean=decodeURIComponent((req.url||'/').split('?')[0]);
  const file=clean==='/'?'/tests/browser/editor-runtime-flow.html':clean;
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
 await page.goto('http://127.0.0.1:'+address.port+'/tests/browser/editor-runtime-flow.html');
 await page.waitForFunction(()=>window.editorRuntimeTestReady===true);
 const field=page.locator('[data-v2-editor-field="personal:name"]');
 await field.fill('Updated Browser User');
 await page.waitForFunction(()=>window.editorRuntime.surface.getState().session.application.masterProfile.careerData.sections[0].fields[0].value==='Updated Browser User');
 const state=await page.evaluate(()=>window.editorRuntime.surface.getState());
 assert.equal(state.session.application.masterProfile.careerData.sections[0].fields[0].value,'Updated Browser User');
 assert.ok(state.session.dirty);
 assert.ok(await page.locator('[data-v2-editor-field]').count()===1);
 console.log(JSON.stringify({mount:'passed',fields:'passed',mutation:'passed',preview:'not-run',templateSwitch:'not-run'}));
}finally{await browser.close();server.close();}
