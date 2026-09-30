export const FINAL_RELEASE_GATE_VERSION = '1.0.0';

export const FINAL_RELEASE_GATES = Object.freeze([
  'R1',
  'R2',
  'R3',
  'R4',
  'R5',
  'R6',
  'R7',
  'R8'
]);

const ACCEPTED_STATUS = new Set(['PASS', 'OPEN', 'CONDITIONAL', 'BLOCKED']);

export function evaluateFinalReleaseGate(gates = {}) {
  const normalized = FINAL_RELEASE_GATES.map(name => ({
    name,
    status: String(gates?.[name]?.status || gates?.[name] || 'OPEN'),
    evidence: gates?.[name]?.evidence || null
  }));

  const invalid = normalized.filter(g => !ACCEPTED_STATUS.has(g.status));
  const blockers = normalized.filter(g => g.name !== 'R8' && g.status !== 'PASS');

  if (gates?.R8?.status === 'PASS' && blockers.length) {
    blockers.push({ name: 'R8', status: 'BLOCKED', evidence: 'R8 cannot pass while an earlier release gate is not PASS.' });
  }

  return Object.freeze({
    version: FINAL_RELEASE_GATE_VERSION,
    status: invalid.length === 0 && blockers.length === 0 ? 'READY' : 'BLOCKED',
    gates: Object.freeze(normalized),
    blockers: Object.freeze([
      ...blockers.map(g => g.name),
      ...invalid.map(g => g.name + ':INVALID_STATUS')
    ]),
    invalidStatuses: Object.freeze(invalid.map(g => g.name))
  });
}

export function assertFinalReleaseReady(result) {
  if (result?.status !== 'READY') {
    throw new Error('Final release is blocked by: ' + (result?.blockers || []).join(', '));
  }
  return true;
}
