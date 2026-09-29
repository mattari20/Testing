import { CAPABILITY, TEMPLATE_STATUS, createTemplateDefinition } from './template-engine.js';

const v1Names = [
  't01-modern-minimalist-cv-design_ats',
  't01-modern-minimalist-cv-design_modern',
  't01-modern-minimalist-cv-design_simple',
  't02-professional-cv-design_modern',
  't03-professional-cv-design_modern',
  't04-modern-blue-corporate_modern',
  't05-simple-cv-graphic-web-designer_modern',
  't06-professional-cv-graphic-designer_modern',
  't07-professional-cv-store-manager-incharge_modern'
];

export const V1_TEMPLATE_COMPATIBILITY_STATE = Object.freeze({
  COMPATIBLE: 'v2-compatible',
  ADAPTER_REQUIRED: 'adapter-required',
  ASSET_RECONCILIATION: 'asset-reconciliation-required',
  NOT_YET_COMPATIBLE: 'not-yet-compatible',
  RETIRED: 'retired-by-explicit-decision'
});

export function createV1TemplateCatalog() {
  return v1Names.map(id => createTemplateDefinition({
    id,
    name: id,
    version: 'v1-baseline',
    status: TEMPLATE_STATUS.TESTING,
    sourceLineage: 'v1-golden-baseline',
    supportedSections: [],
    supportedFields: [],
    supportedFieldTypes: [],
    supportedVariants: [],
    capabilities: {
      'personal.identity': CAPABILITY.UNKNOWN,
      'summary': CAPABILITY.UNKNOWN,
      'education': CAPABILITY.UNKNOWN,
      'experience': CAPABILITY.UNKNOWN,
      'projects': CAPABILITY.UNKNOWN,
      'skills': CAPABILITY.UNKNOWN,
      'languages': CAPABILITY.UNKNOWN,
      'achievements': CAPABILITY.UNKNOWN,
      'theme': CAPABILITY.UNKNOWN,
      'photo': CAPABILITY.UNKNOWN,
      'pagination.a4': CAPABILITY.UNKNOWN
    },
    outputs: { web: true, pdf: true, print: true },
    compatibility: {
      sourceState: V1_TEMPLATE_COMPATIBILITY_STATE.ASSET_RECONCILIATION,
      sourceRequired: true,
      visualBaselineRequired: true,
      noSilentLoss: true
    }
  }));
}

export const V1_TEMPLATE_IDS = Object.freeze([...v1Names]);
