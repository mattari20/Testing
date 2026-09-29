import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile,mkdir,writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const server=createServer(async(req,res)=>{try{const clean=decodeURIComponent((req.url||'/').split('?')[0]);const file=clean==='/'?'/tests/browser/editor-runtime-flow.html':clean;const body=await readFile(path.join(root,file));const ext=path.extname(file);res.writeHead(200,{'Content-Type':ext==='.js'?'text/javascript':ext==='.html'?'text/html':'text/plain'});res.end(body);}catch(e){res.writeHead(404);res.end(String(e));}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const address=server.address();const browser=await chromium.launch({headless:true});
try{const page=await browser.newPage({viewport:{width:1200,height:1000}});await page.goto('http://127.0.0.1:'+address.port+'/tests/browser/editor-runtime-flow.html');await page.waitForFunction(()=>window.editorRuntimeTestReady===true);await page.evaluate(()=>window.runTemplatePreview('t01-modern-minimalist-cv-design_modern'));await page.waitForSelector('#preview [data-v2-template-root],#preview [data-v2-template-id]');const geometry=await page.evaluate(()=>{const root=document.querySelector('#preview [data-v2-template-root],#preview [data-v2-template-id]');const r=root.getBoundingClientRect();return {width:r.width,height:r.height,scrollHeight:root.scrollHeight,scrollWidth:root.scrollWidth};});assert.ok(geometry.width>0);assert.ok(geometry.height>0);const dir=path.join(root,'artifacts/m99');await mkdir(dir,{recursive:true});await page.screenshot({path:path.join(dir,'editor-layout.png'),fullPage:true});await writeFile(path.join(dir,'editor-layout-evidence.json'),JSON.stringify({version:'1.0.0',status:'measured',geometry,measurement:'passed'},null,2));console.log(JSON.stringify({measurement:'passed',geometry}));}finally{await browser.close();server.close();}
