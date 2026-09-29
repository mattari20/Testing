export const TEST_EVIDENCE_VERSION = '1.0.0';

export function createTestEvidenceRecord(input = {}) {
  return Object.freeze({
    version: TEST_EVIDENCE_VERSION,
    suite: String(input.suite || ''),
    status: input.status || 'pending',
    command: input.command || null,
    runId: input.runId || null,
    evidence: input.evidence || null,
    failures: Array.isArray(input.failures) ? [...input.failures] : [],
    capturedAt: input.capturedAt || new Date().toISOString()
  });
}

export function aggregateTestEvidence(records = []) {
  const list = records.map(createTestEvidenceRecord);
  const failed = list.filter(r => r.status !== 'passed');
  return Object.freeze({
    version: TEST_EVIDENCE_VERSION,
    status: failed.length ? 'incomplete' : 'complete',
    suites: list,
    failedSuites: failed.map(r => r.suite),
    passedCount: list.filter(r => r.status === 'passed').length,
    totalCount: list.length
  });
}

export function assertTestEvidenceComplete(result) {
  if (result?.status !== 'complete') {
    throw new Error('Test evidence is incomplete: ' + (result?.failedSuites || []).join(', '));
  }
  return true;
}
