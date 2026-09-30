import test from 'node:test';
import assert from 'node:assert/strict';
import {planRenderedFragments} from '../../src/ui/editor-preview-fragment-planner.js';
import {validateFragmentContinuity} from '../../src/ui/editor-preview-pagination-continuity.js';
import {compareFragmentSequences,validateNoSilentFragmentLoss} from '../../src/ui/editor-preview-fragment-regression.js';
import {createFragmentQualityEvidence} from '../../src/validation/editor-preview-fragment-quality-evidence.js';

test('M148 carries semantic metadata into fragments',()=>{
 const r=planRenderedFragments([{id:'x',order:2,kind:'experience-entry',keepWithNext:true,keepTogether:true}], [{number:1,blocks:[{id:'x',part:1,height:20,state:'fit'}]}]);
 assert.equal(r[0].fragments[0].kind,'experience-entry');
 assert.equal(r[0].fragments[0].keepWithNext,true);
});

test('M149 continuity catches skipped parts',()=>{
 const r=validateFragmentContinuity([{fragments:[{blockId:'x',part:1}]},{fragments:[{blockId:'x',part:3}]}]);
 assert.equal(r.valid,false);
});

test('M152 regression utilities are deterministic',()=>{
 const a=[{pageId:1,fragments:[{blockId:'x',part:1}]}];
 const b=[{pageId:1,fragments:[{blockId:'x',part:1}]}];
 assert.equal(compareFragmentSequences(a,b).same,true);
 assert.equal(validateNoSilentFragmentLoss(a,b).valid,true);
});

test('M153 evidence exposes browser boundary',()=>{
 const e=createFragmentQualityEvidence({fragments:[{fragments:[{}]}],continuity:{valid:true},quality:{geometry:{valid:true},slices:{valid:true}},distribution:{fragmentCount:1},layoutResult:{hasOverflow:false}});
 assert.equal(e.browserRequired,true);
});