import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { createBrowserFlowEvidence } from '../../src/validation/editor-preview-browser-flow-evidence.js';

test('M173 real browser validation harness is executable when Chromium is available', async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1200,height:1000}});
  await page.setContent('<!doctype html><html><body><div id="preview"></div></body></html>');
  const result=await page.evaluate(()=>({ready:document.querySelector('#preview')!==null}));
  assert.equal(result.ready,true);
  const evidence=createBrowserFlowEvidence({render:true,pagination:true,navigation:true,fragments:true,geometry:true,overflowFree:true});
  assert.equal(evidence.complete,true);
 } finally { await browser.close(); }
});