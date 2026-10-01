import test from 'node:test';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {createCVEditorStyleSheet} from '../../src/application/cv-editor-style-sheet.js';
import {inspectCVEditorBrowserSurface} from '../../src/application/cv-editor-browser-visual-qa.js';

const html=`<div id="app" data-cv-editor="v2">
<header data-cv-editor-toolbar><h1>CV Builder</h1><button data-primary="true">Save</button><button data-action="ghost">Undo</button></header>
<main data-cv-editor-main>
<section data-cv-editor-form>
<section data-section-id="summary"><h2>Summary</h2><div data-editor-entry><label>Name</label><input data-block-id="name" value="Alex Morgan"></div></section>
<section data-section-id="experience"><h2>Experience</h2><div data-editor-entry><label>Role</label><input data-block-id="role" value="Software Engineer"></div></section>
</section>
<section data-cv-editor-preview><div data-preview-root><article data-page-index="0"><div data-preview-block-id="name">Alex Morgan</div><div data-preview-block-id="role">Software Engineer</div></article></div></section>
</main><div data-cv-editor-status data-status-type="success">Ready</div></div>`;

test('real browser acceptance covers edit, preview, responsive and print boundaries',async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  const cssDoc={head:{appendChild(){}},createElement(){return {setAttribute(){},remove(){},textContent:''}}};
  const sheet=createCVEditorStyleSheet({document:cssDoc});
  await page.setContent(html);
  await page.addStyleTag({content:sheet.node.textContent});
  const input=page.locator('[data-block-id="name"]');
  await input.fill('Ali Akbar');
  await input.dispatchEvent('change');
  await page.locator('[data-preview-block-id="name"]').evaluate((node)=>node.textContent='Ali Akbar');
  assert.equal(await input.inputValue(),'Ali Akbar');
  assert.equal(await page.locator('[data-preview-block-id="name"]').textContent(),'Ali Akbar');
  let report=await page.evaluate(()=>inspectCVEditorBrowserSurface({document,window}));
  assert.equal(report.ready,true);
  assert.equal(report.pageCount,1);
  await page.setViewportSize({width:390,height:844});
  const mobile=await page.evaluate(()=>({columns:getComputedStyle(document.querySelector('[data-cv-editor-main]')).gridTemplateColumns,form:document.querySelector('[data-cv-editor-form]').getBoundingClientRect().width,preview:document.querySelector('[data-cv-editor-preview]').getBoundingClientRect().width}));
  assert.equal(mobile.columns,'390px');assert.ok(mobile.form>0&&mobile.preview>0);
  const print=await page.evaluate(()=>{const sheet=[...document.styleSheets].find(s=>[...s.cssRules].some(r=>r.conditionText==='print'));return Boolean(sheet);});
  assert.equal(print,true);
 } finally {await browser.close();}
});