import test from 'node:test';
import assert from 'node:assert/strict';
import {createBrowserFlowEvidence} from '../../src/validation/editor-preview-browser-flow-evidence.js';
test('M200 requires actual multi-page fragment evidence',()=>{
 const good=createBrowserFlowEvidence({render:true,pagination:true,navigation:true,fragments:true,geometry:true,overflowFree:true,pageCount:2,fragmentCount:3});
 assert.equal(good.complete,true);
 const bad=createBrowserFlowEvidence({render:true,pagination:true,navigation:true,fragments:true,geometry:true,overflowFree:true,pageCount:1,fragmentCount:3});
 assert.equal(bad.complete,false);
});