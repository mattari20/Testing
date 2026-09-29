export const RELEASE_READINESS_VERSION = '1.0.0';

export const GATE = Object.freeze({
  IMPLEMENTATION: 'implementation',
  TESTS: 'tests',
  GOLDEN_BASELINE: 'golden-baseline',
  SECURITY: 'security',
  BROWSER: 'browser',
  EXPORT: 'export',
  IMPORT: 'import'
});

export function createReleaseReadiness(input = {}) {
  const gates = Object.values(GATE).map(name => ({
    name,
    status: input.gates?.[name] || 'pending',
    evidence: input.evidence?.[name] || null
  }));
  const blockers = gates.filter(g => g.status !== 'passed');
  return Object.freeze({
    version: RELEASE_READINESS_VERSION,
    status: blockers.length ? 'blocked' : 'ready',
    gates,
    blockers: blockers.map(g => g.name),
    generatedAt: new Date().toISOString()
  });
}

export function assertReleaseReady(readiness) {
  if (readiness?.status !== 'ready') {
    throw new Error('Release is blocked by: ' + (readiness?.blockers || []).join(', '));
  }
  return true;
}
