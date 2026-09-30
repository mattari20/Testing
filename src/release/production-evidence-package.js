import { evaluateProductionHandoff } from './production-handoff-gate.js';

export const PRODUCTION_EVIDENCE_PACKAGE_VERSION = '1.0.0';

const FORBIDDEN_KEY_PATTERN = /(password|passwd|secret|api[_-]?key|token|private[_-]?key|credential)/i;

function assertPlainObject(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(label + ' must be a plain object.');
  }
}

export function createProductionEvidencePackage({ smokeRecord, productionSourceBridgeState, evidenceReferences = [] } = {}) {
  assertPlainObject(smokeRecord, 'smokeRecord');

  if (FORBIDDEN_KEY_PATTERN.test(JSON.stringify(smokeRecord))) {
    throw new Error('Production evidence package cannot contain secret-like keys.');
  }

  const handoff = evaluateProductionHandoff({
    ...smokeRecord,
    productionSourceBridgeState
  });

  const refs = Array.isArray(evidenceReferences)
    ? evidenceReferences.filter((ref) => typeof ref === 'string' && ref.trim())
    : [];

  return Object.freeze({
    packageVersion: PRODUCTION_EVIDENCE_PACKAGE_VERSION,
    packageStatus: handoff.ready ? 'ready-for-acceptance' : 'evidence-incomplete',
    r6: handoff.r6,
    productionSourceBridgeState: productionSourceBridgeState || null,
    smokeRecord,
    evidenceReferences: Object.freeze([...refs]),
    validationReasons: Object.freeze([...handoff.reasons])
  });
}

export function validateProductionEvidencePackage(pkg) {
  const errors = [];

  if (pkg?.packageVersion !== PRODUCTION_EVIDENCE_PACKAGE_VERSION) {
    errors.push('Unsupported production evidence package version.');
  }

  if (!['ready-for-acceptance', 'evidence-incomplete'].includes(pkg?.packageStatus)) {
    errors.push('packageStatus must be a supported production evidence state.');
  }

  if (!['PASS', 'OPEN'].includes(pkg?.r6)) {
    errors.push('r6 must be PASS or OPEN.');
  }

  if (!['v1', 'v2', 'blocked'].includes(pkg?.productionSourceBridgeState)) {
    errors.push('productionSourceBridgeState must be explicit.');
  }

  if (!pkg?.smokeRecord || typeof pkg.smokeRecord !== 'object' || Array.isArray(pkg.smokeRecord)) {
    errors.push('smokeRecord is required.');
  }

  if (!Array.isArray(pkg?.evidenceReferences)) {
    errors.push('evidenceReferences must be an array.');
  }

  if (FORBIDDEN_KEY_PATTERN.test(JSON.stringify(pkg))) {
    errors.push('Production evidence package contains secret-like keys.');
  }

  if (pkg?.r6 === 'PASS' && pkg?.packageStatus !== 'ready-for-acceptance') {
    errors.push('R6 PASS requires ready-for-acceptance package status.');
  }

  return Object.freeze({
    valid: errors.length === 0,
    errors: Object.freeze([...new Set(errors)])
  });
}
