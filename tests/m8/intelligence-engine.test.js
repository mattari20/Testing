import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ANALYSIS_TYPE,
  ANALYSIS_STATE,
  FINDING_TYPE,
  SUGGESTION_STATE,
  createAnalysisRequest,
  analyzeATSReadiness,
  analyzeJobMatch,
  analyzeSkillEvidence,
  createAISuggestion,
  transitionAISuggestion,
  markAnalysisStale
} from '../../src/intelligence/intelligence-engine.js';

const snapshot = {
  masterProfileId: 'profile-1',
  targetedCVId: 'cv-1',
  masterProfileRevision: 2,
  targetedCVRevision: 4,
  careerData: {
    sections: [
      { id: 'summary', title: 'Summary', fields: [{ value: 'Software engineer' }], entries: [] },
      { id: 'experience', title: 'Experience', fields: [], entries: [{ values: { role: 'Engineer', description: 'Python and SQL development' } }] },
      { id: 'skills', title: 'Skills', fields: [{ value: 'Python, JavaScript' }], entries: [] },
      { id: 'education', title: 'Education', fields: [{ value: 'BS Computer Science' }], entries: [] }
    ]
  }
};

test('creates analysis requests bound to document snapshot', () => {
  const request = createAnalysisRequest({ documentSnapshot: snapshot, analysisType: ANALYSIS_TYPE.ATS_READINESS });
  assert.equal(request.documentSnapshot.targetedCVRevision, 4);
});

test('ATS readiness returns explainable findings', () => {
  const request = createAnalysisRequest({ documentSnapshot: snapshot, analysisType: ANALYSIS_TYPE.ATS_READINESS });
  const result = analyzeATSReadiness(request);
  assert.equal(result.state, ANALYSIS_STATE.CURRENT);
  assert.ok(Array.isArray(result.findings));
  assert.ok(result.findings.every(f => f.reason && f.evidence && Object.prototype.hasOwnProperty.call(f, 'recommendation')));
});

test('job match separates matched from missing terms', () => {
  const request = createAnalysisRequest({
    documentSnapshot: snapshot,
    analysisType: ANALYSIS_TYPE.JOB_MATCH,
    jobDescription: 'Software Engineer\nSkills: Python, SQL, Kubernetes'
  });
  const result = analyzeJobMatch(request);
  assert.ok(result.findings.some(f => f.type === FINDING_TYPE.MATCHED && f.issue === 'python'));
  assert.ok(result.findings.some(f => f.type === FINDING_TYPE.MISSING && f.issue === 'kubernetes'));
});

test('skill evidence distinguishes absence of visible evidence from lack of skill', () => {
  const request = createAnalysisRequest({ documentSnapshot: snapshot, analysisType: ANALYSIS_TYPE.SKILL_EVIDENCE });
  const result = analyzeSkillEvidence(request, ['Python', 'AWS']);
  assert.equal(result.findings.find(f => f.issue === 'Python').type, FINDING_TYPE.MATCHED);
  assert.equal(result.findings.find(f => f.issue === 'AWS').type, FINDING_TYPE.EVIDENCE_GAP);
});

test('AI suggestions are distinct from authoritative content', () => {
  const suggestion = createAISuggestion({ category: 'bullet-rewrite', text: 'Consider clarifying the outcome.' });
  assert.equal(suggestion.state, SUGGESTION_STATE.GENERATED);
  const edited = transitionAISuggestion(suggestion, SUGGESTION_STATE.EDITED, { editedText: 'Consider adding a measurable outcome if you have one.' });
  assert.equal(edited.state, SUGGESTION_STATE.EDITED);
  assert.equal(edited.appliedTo, null);
});

test('analysis can become stale after source revision changes', () => {
  const request = createAnalysisRequest({ documentSnapshot: snapshot, analysisType: ANALYSIS_TYPE.ATS_READINESS });
  const result = analyzeATSReadiness(request);
  const stale = markAnalysisStale(result, { masterProfileRevision: 3, targetedCVRevision: 4 });
  assert.equal(stale.state, ANALYSIS_STATE.STALE);
});
