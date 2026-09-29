export const SYSTEM_VALIDATION_VERSION = '1.0.0';

export const VALIDATION_AREA = Object.freeze([
  'document-core',
  'lifecycle',
  'templates',
  'layout',
  'preview',
  'export',
  'import',
  'intelligence',
  'security',
  'online-cv',
  'browser',
  'golden-baseline'
]);

export function createSystemValidationMatrix(input = {}) {
  const areas = VALIDATION_AREA.map(area => ({
    area,
    status: input.areas?.[area] || 'pending',
    evidence: input.evidence?.[area] || null,
    blockers: Array.isArray(input.blockers?.[area]) ? [...input.blockers[area]] : []
  }));
  const failed = areas.filter(a => a.status !== 'passed');
  return Object.freeze({
    version: SYSTEM_VALIDATION_VERSION,
    status: failed.length ? 'incomplete' : 'complete',
    areas,
    incompleteAreas: failed.map(a => a.area)
  });
}

export function assertSystemValidationComplete(matrix) {
  if (matrix?.status !== 'complete') {
    throw new Error('System validation is incomplete: ' + (matrix?.incompleteAreas || []).join(', '));
  }
  return true;
}
