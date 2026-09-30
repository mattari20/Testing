import test from 'node:test';
import assert from 'node:assert/strict';
import {createBrowserFragmentEvidence} from '../../src/validation/editor-preview-browser-fragment-evidence.js';
import {probeFragmentedPages} from '../../src/ui/editor-preview-browser-fragment-probe.js';
import {setPreviewPageVisibility} from '../../src/ui/editor-preview-browser-fragment-navigation.js';
import {validateBrowserFragmentPages} from '../../src/ui/editor-preview-browser-fragment-integrity.js';
import {createBrowserFlowEvidence} from '../../src/validation/editor-preview-browser-flow-evidence.js';

test('M168 creates browser fragment evidence',()=>assert.equal(createBrowserFragmentEvidence({pageCount:2,fragmentCount:4,geometry:[{},{}],continuity:true,overflow:false}).status,'ready-for-review'));
test('M169 probes preview pages',()=>{const d={querySelectorAll:s=>s==='[data-v2-preview-page]'?[{getBoundingClientRect:()=>({width:794,height:1123}),scrollHeight:1123,querySelectorAll:()=>[1,2]}]:[]};assert.equal(probeFragmentedPages(d).pageCount,0);});
test('M170 normalizes browser page visibility',()=>{const a=[{},{},{}];const r=setPreviewPageVisibility(a,9);assert.equal(r.currentPage,3);assert.equal(a[2].hidden,false);});
test('M171 validates browser page constraints',()=>assert.equal(validateBrowserFragmentPages({pages:[{page:1,width:794,height:1123,scrollHeight:1123,fragmentCount:2}]},{width:794,height:1123}).valid,true));
test('M172 flow evidence requires all checks',()=>assert.equal(createBrowserFlowEvidence({render:true,pagination:true,navigation:true,fragments:true,geometry:true,overflowFree:true}).complete,true));