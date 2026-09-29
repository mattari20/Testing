import { COMPARISON_DIMENSION, COMPARISON_STATUS, createGoldenBaselineFixture } from './golden-baseline-comparison.js';
import { listNativeV2Templates } from '../templates/v2-native-template-catalog.js';

export const M22_FIXTURE_VERSION = '1.1.0';
const DIMENSIONS = Object.freeze(Object.values(COMPARISON_DIMENSION));

function normalizeTemplateDescriptor(template) {
  if (!template?.id) throw new Error('Template id is required.');
  return {
    templateId: String(template.id),
    baselineId: String(template.v1BaselineId || template.baselineId || template.id),
    sourcePath: template.sourcePath ? String(template.sourcePath) : null,
    status: template.status ? String(template.status) : null
  };
}

export function createComparisonFixtureSet(input = {}) {
  const templates = Array.isArray(input.templates)
    ? input.templates.map(normalizeTemplateDescriptor)
    : listNativeV2Templates().map(normalizeTemplateDescriptor);
  const baselinePrefix = String(input.baselinePrefix || 'v1-golden');
  const fixtureDataId = String(input.fixtureDataId || 'representative-career-document-v1');
  const pageModel = input.pageModel || { format:'A4', width:794, height:1123, orientation:'portrait' };
  const viewport = input.viewport || { width:794, height:1123 };

  return templates.map(template => createGoldenBaselineFixture({
    baselineId: `${baselinePrefix}:${template.baselineId}`,
    templateId: template.templateId,
    fixtureDataId,
    viewport,
    pageModel,
    expected: {
      requiredDimensions: [...DIMENSIONS],
      initialStatus: COMPARISON_STATUS.INSUFFICIENT_EVIDENCE,
      sourcePath: template.sourcePath,
      v1BaselineId: template.baselineId,
      registryStatus: template.status
    }
  }));
}

export function validateComparisonFixtureSet(fixtures, input = {}) {
  const list = Array.isArray(fixtures) ? fixtures : [];
  const registered = new Set(
    (Array.isArray(input.templates) ? input.templates : listNativeV2Templates()).map(template => String(template.id))
  );
  const errors = [];
  const ids = new Set();
  if (list.length === 0) errors.push('TEMPLATE_FIXTURE_SET_EMPTY');

  for (const fixture of list) {
    if (ids.has(fixture.templateId)) errors.push('DUPLICATE_TEMPLATE_FIXTURE:' + fixture.templateId);
    ids.add(fixture.templateId);
    if (!registered.has(fixture.templateId)) errors.push('UNREGISTERED_TEMPLATE:' + fixture.templateId);
    if (fixture.fixtureDataId !== 'representative-career-document-v1') errors.push('UNCONTROLLED_FIXTURE_DATA:' + fixture.templateId);
    for (const dimension of DIMENSIONS) {
      if (!fixture.expected?.requiredDimensions?.includes(dimension)) {
        errors.push(`MISSING_DIMENSION:${fixture.templateId}:${dimension}`);
      }
    }
  }
  return { valid: errors.length === 0, errors };
}
