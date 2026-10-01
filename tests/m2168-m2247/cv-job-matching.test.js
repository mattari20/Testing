import test from 'node:test';import assert from 'node:assert/strict';import {matchCVToJob,validateJobMatch} from '../../src/application/cv-job-matching.js';
const snap={careerData:{sections:[{fields:[{value:'JavaScript React Engineer'}]}]}};
test('M2168-M2183 matches CV keywords to job',()=>{const r=matchCVToJob(snap,{keywords:['javascript','react']});assert.equal(r.matchedCount,2);assert.equal(validateJobMatch(r).valid,true);});
test('M2184-M2199 reports missing job terms',()=>{const r=matchCVToJob(snap,{keywords:['python']});assert.deepEqual(r.missing,['python']);});
test('M2200-M2215 supports description-derived terms',()=>{const r=matchCVToJob(snap,{description:'react engineer'});assert.ok(r.keywordCount>0);});
test('M2216-M2231 keeps ratio bounded',()=>{const r=matchCVToJob(snap,{keywords:['react','python']});assert.ok(r.matchRatio>=0&&r.matchRatio<=1);});
test('M2232-M2247 validates evidence shape',()=>{assert.equal(validateJobMatch({version:'x',matchRatio:2}).valid,false);});
