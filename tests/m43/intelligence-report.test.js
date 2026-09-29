import test from 'node:test';
import assert from 'node:assert/strict';
import { ANALYSIS_TYPE, FINDING_TYPE } from '../../src/intelligence/intelligence-engine.js';
import { createIntelligenceReport, filterReportFindings } from '../../src/intelligence/intelligence-report.js';
const snapshot={masterProfileId:'p1',targetedCVId:'cv1',masterProfileRevision:'1',targetedCVRevision:'1',careerData:{identity:{name:'Ali',job:'Engineer'},sections:[{title:'Experience',fields:[{value:'JavaScript engineer'}],entries:[]},{title:'Skills',fields:[{value:'JavaScript'}],entries:[]},{title:'Education',fields:[],entries:[]},{title:'Summary',fields:[{value:'Engineer'}],entries:[]}]}}};
test('creates ATS report',()=>{const r=createIntelligenceReport({analysisType:ANALYSIS_TYPE.ATS_READINESS,documentSnapshot:snapshot});assert.equal(r.analysisType,ANALYSIS_TYPE.ATS_READINESS);assert.ok(r.summary.findingCount>=0);});
test('creates job match report and filters findings',()=>{const r=createIntelligenceReport({analysisType:ANALYSIS_TYPE.JOB_MATCH,documentSnapshot:snapshot,jobDescription:'JavaScript Engineer\nSkills: React'});const f=filterReportFindings(r,[FINDING_TYPE.MATCHED]);assert.ok(f.findings.every(x=>x.type===FINDING_TYPE.MATCHED));});
