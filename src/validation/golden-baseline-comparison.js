export const M21_GOLDEN_COMPARISON_VERSION = '1.0.0';

export const COMPARISON_STATUS = Object.freeze({
  IDENTICAL_WITHIN_TOLERANCE: 'identical-within-tolerance',
  INTENTIONAL_DIFFERENCE: 'intentional-difference',
  COMPATIBILITY_ADAPTATION: 'compatibility-adaptation',
  REGRESSION: 'regression',
  INSUFFICIENT_EVIDENCE: 'insufficient-evidence'
});

export const COMPARISON_DIMENSION = Object.freeze({
  TYPOGRAPHY: 'typography',
  COLOR: 'color',
  SPACING: 'spacing',
  HIERARCHY: 'hierarchy',
  COLUMNS: 'columns',
  PHOTO: 'photo',
  ICONS: 'icons',
  BACKGROUND: 'background',
  PAGE_STRUCTURE: 'page-structure',
  CONTENT_VISIBILITY: 'content-visibility',
  PAGINATION: 'pagination'
});

const clone = value => JSON.parse(JSON.stringify(value));

export function createGoldenBaselineFixture(input = {}) {
  if (!input.templateId) throw new Error('templateId is required.');
  if (!input.baselineId) throw new Error('baselineId is required.');
  return Object.freeze({
    version: M21_GOLDEN_COMPARISON_VERSION,
    baselineId: String(input.baselineId),
    templateId: String(input.templateId),
    viewport: { width: Number(input.viewport?.width || 794), height: Number(input.viewport?.height || 1123) },
    pageModel: clone(input.pageModel || { format: 'A4', width: 794, height: 1123 }),
    fixtureDataId: String(input.fixtureDataId || 'representative-career-document-v1'),
    expected: clone(input.expected || {}),
    evidence: clone(input.evidence || [])
  });
}

export function compareGoldenEvidence(input = {}) {
  const dimensions = Array.isArray(input.dimensions) ? input.dimensions : [];
  const results = dimensions.map(dimension => ({
    dimension: String(dimension.dimension),
    status: String(dimension.status || COMPARISON_STATUS.INSUFFICIENT_EVIDENCE),
    evidence: clone(dimension.evidence || []),
    note: String(dimension.note || '')
  }));

  const blocking = results.filter(result => result.status === COMPARISON_STATUS.REGRESSION);
  const insufficient = results.filter(result => result.status === COMPARISON_STATUS.INSUFFICIENT_EVIDENCE);

  return {
    version: M21_GOLDEN_COMPARISON_VERSION,
    templateId: input.templateId ? String(input.templateId) : null,
    baselineId: input.baselineId ? String(input.baselineId) : null,
    results,
    blockingRegression: blocking.length > 0,
    evidenceComplete: insufficient.length === 0
  };
}
