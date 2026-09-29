import test from 'node:test';
import assert from 'node:assert/strict';
import { ANALYSIS_TYPE } from '../../src/intelligence/intelligence-engine.js';
import { runProductionIntelligence, validateIntelligenceResult } from '../../src/intelligence/production-intelligence.js';
const snapshot={masterProfileId:'p1',targetedCVId:'cv1',masterProfileRevision:'1',targetedCVRevision:'1',careerData:{identity:{name:'Ali',job:'Engineer'},sections:[{title:'Experience',fields:[{value:'JavaScript engineer'}],entries:[]},{title:'Skills',fields:[{value:'JavaScript'}],entries:[]},{title:'Education',fields:[],entries:[]} ]}};
test('runs ATS analysis through production boundary',()=>{const r=runProductionIntelligence({analysisType:ANALYSIS_TYPE.ATS_READINESS,documentSnapshot:snapshot});assert.equal(validateIntelligenceResult(r).valid,true);});
test('runs job match through production boundary',()=>{const r=runProductionIntelligence({analysisType:ANALYSIS_TYPE.JOB_MATCH,documentSnapshot:snapshot,jobDescription:'JavaScript Engineer\nSkills: JavaScript React'});assert.ok(r.findings.length>0);});
