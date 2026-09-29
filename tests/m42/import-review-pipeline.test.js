import test from 'node:test';
import assert from 'node:assert/strict';
import { prepareStructuredImport, prepareV1MigrationReview, acceptReview, partialAcceptReview, markReviewRejected } from '../../src/import/import-review-pipeline.js';
test('structured import requires review',()=>{const r=prepareStructuredImport({data:{name:'Ali'}});assert.equal(r.review.requiresHumanAcceptance,true);assert.equal(r.review.autoApply,false);});
test('V1 migration produces acceptance review',()=>{const r=prepareV1MigrationReview({cv:{personal:{name:'Ali'},education:[],experience:[],projects:[],skills:[],languages:[],achievements:[]},cvVisibility:{}});assert.equal(r.review.requiresHumanAcceptance,true);});
test('supports full and partial acceptance',()=>{const r=prepareStructuredImport({data:{name:'Ali'}});assert.equal(acceptReview(r).reviewState,'accepted');assert.equal(partialAcceptReview(r,{name:'Ali'},['phone']).reviewState,'partially-accepted');});
test('supports rejection',()=>{const r=prepareStructuredImport({data:{name:'Ali'}});assert.equal(markReviewRejected(r).reviewState,'rejected');});
