import test from 'node:test';
import assert from 'node:assert/strict';
import {CV_EDITOR_BROWSER_VISUAL_QA_VERSION,inspectCVEditorBrowserSurface,CV_EDITOR_BROWSER_VISUAL_QA_CHECKS} from '../../src/application/cv-editor-browser-visual-qa.js';
function fakeNode(rect={width:800,height:600}){return {getBoundingClientRect:()=>rect,querySelector:()=>null};}
function fakeDocument(){
 const root=fakeNode();
 const map=new Map([['[data-cv-editor="v2"]',root],['[data-cv-editor-toolbar]',fakeNode({width:800,height:56})],['[data-cv-editor-main]',fakeNode({width:800,height:600})],['[data-cv-editor-form]',fakeNode({width:380,height:600})],['[data-cv-editor-preview]',fakeNode({width:400,height:600})],['[data-cv-editor-status]',fakeNode({width:800,height:40})]]);
 return {defaultView:{getComputedStyle:()=>({backgroundColor:'rgb(255, 255, 255)',color:'rgb(23, 32, 51)'})},querySelector:s=>map.get(s)||null,querySelectorAll:s=>s.includes('article')?[fakeNode({width:794,height:1123})]:[]};
}
test('browser visual QA contract defines the expected checks',()=>{assert.equal(CV_EDITOR_BROWSER_VISUAL_QA_VERSION,'1.0.0');assert.ok(CV_EDITOR_BROWSER_VISUAL_QA_CHECKS.includes('brand-colors'));assert.ok(CV_EDITOR_BROWSER_VISUAL_QA_CHECKS.includes('mobile-layout'));});
test('browser visual QA inspects the mounted editor surface',()=>{const report=inspectCVEditorBrowserSurface({document:fakeDocument()});assert.equal(report.ready,true);assert.equal(report.pageCount,1);assert.equal(report.failures.length,0);assert.ok(report.metrics.form.width>0);});
