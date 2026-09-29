import { COMPARISON_DIMENSION, COMPARISON_STATUS, createGoldenBaselineFixture } from './golden-baseline-comparison.js';

export const M22_FIXTURE_VERSION = '1.0.0';

export const M22_TEMPLATE_IDS = Object.freeze([
  't01-modern-minimalist-cv-design_modern',
  't02-professional-cv-design_modern',
  't03-professional-cv-design_modern',
  't04-modern-blue-corporate_modern',
  't05-simple-cv-graphic-web-designer_modern',
  't06-professional-cv-graphic-designer_modern',
  't07-professional-cv-store-manager-incharge_modern'
]);

const DIMENSIONS = Object.freeze(Object.values(COMPARISON_DIMENSION));

export function createComparisonFixtureSet(input = {}) {
  const baselinePrefix = String(input.baselinePrefix || 'v1-golden');
  const fixtureDataId = String(input.fixtureDataId || 'representative-career-document-v1');
  const pageModel = input.pageModel || { format:'A4', width:794, height:1123, orientation:'portrait' };
  return M22_TEMPLATE_IDS.map(templateId => createGoldenBaselineFixture({
    baselineId: `${baselinePrefix}:${templateId}`,
    templateId,
    fixtureDataId,
    viewport: input.viewport || { width:794, height:1123 },
    pageModel,
    expected: {
      requiredDimensions: [...DIMENSIONS],
      initialStatus: COMPARISON_STATUS.INSUFFICIENT_EVIDENCE
    }
  }));
}

export function validateComparisonFixtureSet(fixtures) {
  const list = Array.isArray(fixtures) ? fixtures : [];
  const errors = [];
  const ids = new Set();

  if (list.length !== M22_TEMPLATE_IDS.length) errors.push('SEVEN_TEMPLATE_FIXTURE_SET_REQUIRED');

  for (const fixture of list) {
    if (ids.has(fixture.templateId)) errors.push('DUPLICATE_TEMPLATE_FIXTURE:' + fixture.templateId);
    ids.add(fixture.templateId);
    if (!M22_TEMPLATE_IDS.includes(fixture.templateId)) errors.push('UNKNOWN_TEMPLATE:' + fixture.templateId);
    if (fixture.fixtureDataId !== 'representative-career-document-v1') errors.push('UNCONTROLLED_FIXTURE_DATA:' + fixture.templateId);
    for (const dimension of DIMENSIONS) {
      if (!fixture.expected?.requiredDimensions?.includes(dimension)) errors.push(`MISSING_DIMENSION:${fixture.templateId}:${dimension}`);
    }
  }

  return { valid: errors.length === 0, errors };
}
