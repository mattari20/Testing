import test from 'node:test';import assert from 'node:assert/strict';import {analyzeCVForATS,validateATSResult} from '../../src/application/cv-ats-analysis.js';
const snap={careerData:{identity:{name:'Ali'},sections:[{fields:[{value:'Engineer Python'}],entries:[{values:{role:'Engineer'}}]}]}};
test('M2088-M2103 produces ATS analysis',()=>{const r=analyzeCVForATS(snap,{keywords:['python']});assert.equal(r.keywords.matched[0],'python');assert.equal(validateATSResult(r).valid,true);});
test('M2104-M2119 reports missing keywords',()=>{const r=analyzeCVForATS(snap,{keywords:['java']});assert.deepEqual(r.keywords.missing,['java']);});
test('M2120-M2135 counts source content',()=>{const r=analyzeCVForATS(snap);assert.equal(r.counts.sections,1);assert.equal(r.counts.fields,1);});
test('M2136-M2151 score remains bounded',()=>{const r=analyzeCVForATS(snap);assert.ok(r.score>=0&&r.score<=100);});
test('M2152-M2167 rejects invalid result',()=>{assert.equal(validateATSResult({version:'x',score:200}).valid,false);});
