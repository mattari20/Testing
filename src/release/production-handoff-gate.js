import { validateProductionSmokeRecord } from './production-smoke-record.js';

export const PRODUCTION_HANDOFF_GATE_VERSION = '1.0.0';

export function evaluateProductionHandoff(record) {
  const smoke = validateProductionSmokeRecord(record);
  const reasons = [...smoke.errors];

  if (smoke.valid && record?.productionSourceBridgeState !== 'v2') {
    reasons.push('productionSourceBridgeState must be v2 before R6 can be accepted.');
  }

  return Object.freeze({
    version: PRODUCTION_HANDOFF_GATE_VERSION,
    ready: reasons.length === 0,
    r6: reasons.length === 0 ? 'PASS' : 'OPEN',
    reasons: Object.freeze([...new Set(reasons)])
  });
}
