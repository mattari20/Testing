import { ANALYSIS_TYPE, createAnalysisRequest, analyzeATSReadiness, analyzeJobMatch, analyzeSkillEvidence } from './intelligence-engine.js';

export const PRODUCTION_INTELLIGENCE_VERSION = '1.0.0';

export function runProductionIntelligence(input = {}) {
  const request = createAnalysisRequest(input);
  if (request.analysisType === ANALYSIS_TYPE.ATS_READINESS || request.analysisType === ANALYSIS_TYPE.RESUME_HEALTH) return analyzeATSReadiness(request);
  if (request.analysisType === ANALYSIS_TYPE.JOB_MATCH) return analyzeJobMatch(request);
  if (request.analysisType === ANALYSIS_TYPE.SKILL_EVIDENCE) return analyzeSkillEvidence(request, input.skills || []);
  throw new Error('Unsupported production intelligence analysis.');
}

export function validateIntelligenceResult(result) {
  const errors = [];
  if (!result?.analysisId) errors.push('ANALYSIS_ID_REQUIRED');
  if (!result?.analysisType) errors.push('ANALYSIS_TYPE_REQUIRED');
  if (!Array.isArray(result?.findings)) errors.push('FINDINGS_REQUIRED');
  if (!result?.source) errors.push('SOURCE_PROVENANCE_REQUIRED');
  return { valid: errors.length === 0, errors };
}
