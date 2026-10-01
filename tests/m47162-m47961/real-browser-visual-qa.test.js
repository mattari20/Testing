import test from 'node:test';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {createCVEditorStyleSheet} from '../../src/application/cv-editor-style-sheet.js';

function styleDocument(){
 const head={appendChild(node){this.node=node;}};
 return {head,createElement(){return {attributes:{},setAttribute(k,v){this.attributes[k]=v;},remove(){},textContent:''};}};
}
test('real browser validates V2 editor responsive visual contract',async()=>{
 const document=styleDocument();
 const sheet=createCVEditorStyleSheet({document});
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  await page.setContent(`<div data-cv-editor="v2"><header data-cv-editor-toolbar><h1>CV Builder</h1><button data-primary="true">Save</button></header><main data-cv-editor-main><section data-cv-editor-form><section data-section-id="summary"><h2>Summary</h2><div data-editor-entry><label>Name</label><input value="Alex Morgan"></div></section></section><section data-cv-editor-preview><div data-preview-root><article data-page-index="0"><div data-preview-block-id="name">Alex Morgan</div></article></div></section></main><div data-cv-editor-status data-status-type="success">Ready</div></div>`);
  await page.addStyleTag({content:sheet.node.textContent});
  const desktop=await page.evaluate(()=>{const root=document.querySelector('[data-cv-editor="v2"]'),main=document.querySelector('[data-cv-editor-main]'),preview=document.querySelector('[data-cv-editor-preview]'),page=document.querySelector('[data-cv-editor-preview] article');const cs=getComputedStyle(root);return {rootBg:cs.backgroundColor,mainWidth:main.getBoundingClientRect().width,previewWidth:preview.getBoundingClientRect().width,pageWidth:page.getBoundingClientRect().width};});
  assert.ok(desktop.mainWidth>0);assert.ok(desktop.previewWidth>0);assert.ok(desktop.pageWidth>0);
  await page.setViewportSize({width:390,height:844});
  const mobile=await page.evaluate(()=>{const main=document.querySelector('[data-cv-editor-main]'),form=document.querySelector('[data-cv-editor-form]'),preview=document.querySelector('[data-cv-editor-preview]');return {columns:getComputedStyle(main).gridTemplateColumns,formWidth:form.getBoundingClientRect().width,previewWidth:preview.getBoundingClientRect().width};});
  assert.match(mobile.columns,/^\\d+(?:\\.\\d+)?px$/);assert.ok(Number.parseFloat(mobile.columns)>0);assert.ok(mobile.formWidth>0);assert.ok(mobile.previewWidth>0);assert.ok(Math.abs(mobile.formWidth-Number.parseFloat(mobile.columns))<1);
 } finally {await browser.close();}
});
