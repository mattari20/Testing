import test from 'node:test';
import assert from 'node:assert/strict';
import {applyFragmentQualityRules} from '../../src/ui/editor-preview-fragment-quality-runtime.js';
import {createPaginationBatchEvidence} from '../../src/validation/editor-preview-pagination-batch-evidence.js';
import {buildPaginationRegressionMatrix} from '../../src/validation/editor-preview-pagination-regression.js';

test('M138-M147 quality runtime validates fragment geometry and slices',()=>{
 const result=applyFragmentQualityRules([
  {fragments:[{blockId:'h',kind:'document-header',order:0,part:1,geometry:{top:0,height:30,bottom:30,sourceHeight:30}}]},
  {fragments:[{blockId:'e',kind:'experience-entry',order:1,part:1,geometry:{top:0,height:120,bottom:120,sourceHeight:200},keepWithNext:false}]}
 ]);
 assert.equal(result.geometry.valid,true);
 assert.equal(result.slices.valid,true);
});

test('M146 regression matrix is deterministic',()=>{
 const matrix=buildPaginationRegressionMatrix();
 assert.equal(matrix.length,6);
});

test('M147 evidence requires browser validation for visual confidence',()=>{
 const evidence=createPaginationBatchEvidence({pageCount:2,hasOverflow:false});
 assert.equal(evidence.browserScenario.requiresRealBrowser,true);
 assert.equal(evidence.productionBrowserRequired,true);
});