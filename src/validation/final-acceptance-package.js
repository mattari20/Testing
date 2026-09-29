import { createSystemValidationMatrix } from './system-validation-matrix.js';
import { createReleaseReadiness } from '../release/release-readiness.js';

export const ACCEPTANCE_PACKAGE_VERSION = '1.0.0';

export function createFinalAcceptancePackage(input = {}) {
  const validationMatrix = createSystemValidationMatrix(input.validation || {});
  const releaseReadiness = createReleaseReadiness(input.release || {});
  const blockers = [
    ...validationMatrix.incompleteAreas.map(x => 'validation:' + x),
    ...releaseReadiness.blockers.map(x => 'release:' + x)
  ];
  return Object.freeze({
    version: ACCEPTANCE_PACKAGE_VERSION,
    status: blockers.length ? 'blocked' : 'ready',
    validationMatrix,
    releaseReadiness,
    blockers,
    evidence: input.evidence || {},
    generatedAt: new Date().toISOString()
  });
}

export function assertFinalAcceptanceReady(pkg) {
  if (pkg?.status !== 'ready') throw new Error('Final acceptance package is blocked: ' + (pkg?.blockers || []).join(', '));
  return true;
}
