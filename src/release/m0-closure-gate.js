export const M0_CLOSURE_VERSION = '1.0.0';

export const M0_GATE = Object.freeze({
  BASELINE_FIXTURES: 'baseline-fixtures',
  CREDENTIAL_ROTATION: 'credential-rotation',
  HISTORY_SECRET_SCAN: 'history-secret-scan',
  T01_ASSET_RECONCILIATION: 't01-asset-reconciliation',
  DEMO_ASSET_RECONCILIATION: 'demo-asset-reconciliation'
});

export function createM0ClosureGate(input = {}) {
  const gates = Object.values(M0_GATE).map(name => ({
    name,
    status: input.gates?.[name] || 'pending',
    evidence: input.evidence?.[name] || null
  }));
  const blockers = gates.filter(g => g.status !== 'passed');
  return Object.freeze({
    version: M0_CLOSURE_VERSION,
    status: blockers.length ? 'blocked' : 'closed',
    gates,
    blockers: blockers.map(g => g.name)
  });
}

export function assertM0Closed(gate) {
  if (gate?.status !== 'closed') {
    throw new Error('M0 is not closed: ' + (gate?.blockers || []).join(', '));
  }
  return true;
}
