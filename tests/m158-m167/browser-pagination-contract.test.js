import test from 'node:test';
import assert from 'node:assert/strict';
import {measurePreviewPages} from '../../src/ui/editor-preview-page-geometry.js';
import {createPageNavigationState} from '../../src/ui/editor-preview-page-navigation-contract.js';
import {validateDistributedFragments} from '../../src/ui/editor-preview-fragment-dom-integrity.js';
import {createFragmentRuntimeEvidence} from '../../src/ui/editor-preview-fragment-runtime-evidence.js';
import {validateBrowserPaginationGeometry} from '../../src/validation/editor-preview-browser-pagination-contract.js';

test('page geometry is measured',()=>assert.equal(measurePreviewPages([{getBoundingClientRect:()=>({width:794,height:1123}),scrollHeight:1123,scrollWidth:794}])[0].height,1123));
test('page navigation is normalized',()=>assert.equal(createPageNavigationState(3,9).currentPage,3));
test('distributed fragments retain identity',()=>assert.equal(validateDistributedFragments([{querySelectorAll:()=>[{getAttribute:()=> 'x'}]}]).valid,true));
test('runtime evidence exposes fragment count',()=>assert.equal(createFragmentRuntimeEvidence({layoutResult:{pageCount:2},distribution:{fragmentCount:3},continuity:{valid:true},quality:{geometry:{valid:true},slices:{valid:true}}}).fragmentCount,3));
test('overflow geometry is rejected',()=>assert.equal(validateBrowserPaginationGeometry([{page:1,width:794,height:1123,scrollHeight:1200}],{width:794,height:1123}).valid,false));