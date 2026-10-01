import test from 'node:test';import assert from 'node:assert/strict';import {createAIRequest,createAIResult,validateAIResult} from '../../src/application/cv-ai-intelligence.js';
const snap={targetedCVId:'cv1',careerData:{sections:[]}};
test('M2248-M2263 creates controlled AI request',()=>{const r=createAIRequest({task:'improve',documentSnapshot:snap});assert.equal(r.task,'improve');});
test('M2264-M2279 supports tailoring context',()=>{const r=createAIRequest({task:'tailor',documentSnapshot:snap,jobContext:{title:'Engineer'}});assert.equal(r.jobContext.title,'Engineer');});
test('M2280-M2295 rejects unknown AI tasks',()=>{assert.throws(()=>createAIRequest({task:'unknown',documentSnapshot:snap}));});
test('M2296-M2311 creates review-required AI result',()=>{const q=createAIRequest({task:'suggest',documentSnapshot:snap});const r=createAIResult(q,{suggestions:[{text:'Improve summary'}]});assert.equal(r.requiresReview,true);assert.equal(validateAIResult(r).valid,true);});
test('M2312-M2327 keeps provider choice outside contract',()=>{const q=createAIRequest({task:'summarize',documentSnapshot:snap});const r=createAIResult(q);assert.equal(r.provider,null);});
