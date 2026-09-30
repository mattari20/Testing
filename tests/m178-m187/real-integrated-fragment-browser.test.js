import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root=path.resolve(process.cwd());
const server=createServer(async(req,res)=>{
 try{
  const clean=decodeURIComponent((req.url||'/').split('?')[0]);
  const file=clean==='/'?'/tests/browser/editor-runtime-flow.html':clean;
  const body=await readFile(path.join(root,file));
  const ext=path.extname(file);
  res.writeHead(200,{'Content-Type':ext==='.js'?'text/javascript':'text/html'});
  res.end(body);
 }catch(error){res.writeHead(404);res.end(String(error));}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const address=server.address();
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:1200,height:1000}});
 await page.goto('http://127.0.0.1:'+address.port+'/tests/browser/editor-runtime-flow.html');
 await page.waitForFunction(()=>window.editorRuntimeTestReady===true);
 await page.evaluate(()=>window.runTemplatePreview('t01-modern-minimalist-cv-design_modern'));
 const fragmentation=await page.evaluate(()=>window.runFragmentationDemo());
 assert.ok(fragmentation.runtime.layoutResult.pageCount>=2);
 assert.ok(fragmentation.distribution.fragmentCount>0);
 assert.equal(fragmentation.integrity.valid,true);
 assert.equal(fragmentation.runtime.continuity.valid,true);
 assert.ok(fragmentation.probe.pages.every(item=>item.scrollHeight<=item.height+2));
 await page.screenshot({path:path.replace('.js','.png'),fullPage:true});
 await page.waitForSelector('#preview [data-v2-template-root],#preview [data-v2-template-id]');
 const result=await page.evaluate(()=>{
  const root=document.querySelector('#preview [data-v2-template-root],#preview [data-v2-template-id]');
  const rect=root.getBoundingClientRect();
  return {rendered:Boolean(root),width:rect.width,height:rect.height,scrollHeight:root.scrollHeight,textLength:root.innerText.length};
 });
 assert.equal(result.rendered,true);
 assert.ok(result.width>0);
 assert.ok(result.height>0);
}finally{
 await browser.close();
 server.close();
}
