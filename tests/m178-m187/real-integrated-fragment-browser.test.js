import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const root=path.resolve(process.cwd());
const evidenceDir=path.join(root,'tests/m208-m217');
await mkdir(evidenceDir,{recursive:true});
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

 const template=await page.evaluate(()=>window.runTemplatePreview('t01-modern-minimalist-cv-design_modern'));
 const templateEvidence=await page.evaluate(()=>{
  const root=document.querySelector('#preview [data-v2-template-root],#preview [data-v2-template-id]');
  if(!root) return {rendered:false};
  const rect=root.getBoundingClientRect();
  return {rendered:true,width:rect.width,height:rect.height,scrollHeight:root.scrollHeight,textLength:root.innerText.length};
 });
 assert.equal(templateEvidence.rendered,true);
 assert.ok(templateEvidence.width>0);
 assert.ok(templateEvidence.height>0);
 await page.screenshot({path:path.join(evidenceDir,'template-before-fragmentation.png'),fullPage:true});

 await page.evaluate(()=>window.runFragmentationDemo());
 const browserEvidence=await page.evaluate(()=>{
  const pages=[...document.querySelectorAll('#preview [data-v2-preview-page]')];
  const fragments=[...document.querySelectorAll('#preview [data-v2-fragment-of]')];
  const perBlock=new Map();
  for(const fragment of fragments){
   const blockId=fragment.dataset.v2FragmentOf;
   const part=Number(fragment.dataset.v2FragmentPart||1);
   const page=Number(fragment.closest('[data-v2-preview-page]')?.dataset.v2PageNumber||0);
   if(!perBlock.has(blockId)) perBlock.set(blockId,[]);
   perBlock.get(blockId).push({part,page});
  }
  const ordering=[...perBlock.entries()].map(([blockId,parts])=>({
   blockId,
   parts,
   ordered:parts.every((item,index)=>index===0 || item.part===parts[index-1].part+1)
  }));
  return {
   pageCount:pages.length,
   fragmentCount:fragments.length,
   pages:pages.map((page,index)=>({
    page:index+1,
    width:page.getBoundingClientRect().width,
    height:page.getBoundingClientRect().height,
    scrollHeight:page.scrollHeight,
    fragmentCount:page.querySelectorAll('[data-v2-fragment-of]').length,
    visible:!page.hidden
   })),
   ordering,
   visiblePages:pages.filter(page=>!page.hidden).length
  };
 });
 assert.ok(browserEvidence.pageCount>=2);
 assert.ok(browserEvidence.fragmentCount>0);
 assert.ok(browserEvidence.pages.every(item=>Math.abs(item.width-794)<=2), JSON.stringify(browserEvidence.pages));
 assert.ok(browserEvidence.pages.every(item=>item.height<=1125));
 assert.ok(browserEvidence.pages.every(item=>item.scrollHeight<=item.height+2));
 assert.ok(browserEvidence.ordering.length>0);
 assert.ok(browserEvidence.ordering.every(item=>item.ordered));

 const navigationEvidence=[];
 for(let pageNumber=1;pageNumber<=browserEvidence.pageCount;pageNumber++){
  const state=await page.evaluate((n)=>window.setFragmentPage(n),pageNumber);
  const visible=await page.evaluate(()=>[...document.querySelectorAll('#preview [data-v2-preview-page]')].map((el,index)=>({page:index+1,hidden:el.hidden})));
  assert.equal(state.currentPage,pageNumber);
  assert.equal(visible.filter(item=>!item.hidden).length,1);
  assert.equal(visible.find(item=>!item.hidden)?.page,pageNumber);
  navigationEvidence.push({requestedPage:pageNumber,state,visible});
 }
 const finalNavigation=await page.evaluate(()=>window.setFragmentPage(1));
 assert.equal(finalNavigation.currentPage,1);

 await page.screenshot({path:path.join(evidenceDir,'fragmentation-after.png'),fullPage:true});

 const evidence={
  schemaVersion:'1.0.0',
  test:'M208-M217 integrated browser fragmentation',
  template:{id:'t01-modern-minimalist-cv-design_modern',...templateEvidence},
  fragmentation:browserEvidence,
  navigation:navigationEvidence,
  complete:Boolean(
   templateEvidence.rendered &&
   browserEvidence.pageCount>1 &&
   browserEvidence.fragmentCount>0 &&
   browserEvidence.pages.every(item=>Math.abs(item.width-794)<=2 && item.height<=1125 && item.scrollHeight<=item.height+2) &&
   browserEvidence.ordering.every(item=>item.ordered) &&
   navigationEvidence.length===browserEvidence.pageCount
  )
 };
 await writeFile(path.join(evidenceDir,'browser-fragmentation-evidence.json'),JSON.stringify(evidence,null,2));
 assert.equal(evidence.complete,true);
}finally{
 await browser.close();
 server.close();
}
