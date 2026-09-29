import { runProductionIntelligence, validateIntelligenceResult } from './production-intelligence.js';

export const INTELLIGENCE_REPORT_VERSION = '1.0.0';

function summarize(findings = []) {
  const counts = {};
  for (const finding of findings) counts[finding.type] = (counts[finding.type] || 0) + 1;
  return counts;
}

export function createIntelligenceReport(input = {}) {
  const result = runProductionIntelligence(input);
  const validation = validateIntelligenceResult(result);
  if (!validation.valid) throw new Error('Invalid intelligence result: ' + validation.errors.join(', '));
  return Object.freeze({
    version: INTELLIGENCE_REPORT_VERSION,
    analysisId: result.analysisId,
    analysisType: result.analysisType,
    state: result.state,
    source: result.source,
    summary: {
      findingCount: result.findings.length,
      byType: summarize(result.findings),
      metrics: result.metrics || {}
    },
    findings: result.findings,
    requirements: result.requirements || null,
    generatedAt: result.generatedAt
  });
}

export function filterReportFindings(report, types = []) {
  const allowed = new Set(types.map(String));
  return {
    ...report,
    findings: allowed.size ? report.findings.filter(f => allowed.has(f.type)) : [...report.findings]
  };
}
