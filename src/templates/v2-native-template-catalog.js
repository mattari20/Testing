import { TEMPLATE_STATUS, createTemplateDefinition } from './template-engine.js';

export const V2_NATIVE_TEMPLATE_STATUS = Object.freeze({
  SOURCE_CONVERTED: 'source-converted',
  VALIDATION_PENDING: 'pending-browser-validation',
  COMPATIBLE: 'v2-compatible'
});

const nativeTemplates = [
  {
    id: 't01-modern-minimalist-cv-design_modern',
    name: 'T01 Modern Minimalist CV — Native V2',
    version: '2.0.0',
    status: V2_NATIVE_TEMPLATE_STATUS.SOURCE_CONVERTED,
    compatibility: V2_NATIVE_TEMPLATE_STATUS.VALIDATION_PENDING,
    v1BaselineId: 't01-modern-minimalist-cv-design_modern',
    sourcePath: 'src/templates/assets/v2/t01-modern-minimalist-cv-design_modern.html',
    supportedSections: ["photo","contact","summary","experience","education"],
    capabilities: { nativeContract: true, v1VisualEquivalence: 'pending', browserMeasurement: 'pending', paginationEvidence: 'pending', exportEvidence: 'pending' }
  },
  {
    id: 't02-professional-cv-design_modern',
    name: 'T02 Professional CV — Native V2',
    version: '2.0.0',
    status: V2_NATIVE_TEMPLATE_STATUS.SOURCE_CONVERTED,
    compatibility: V2_NATIVE_TEMPLATE_STATUS.VALIDATION_PENDING,
    v1BaselineId: 't02-professional-cv-design_modern',
    sourcePath: 'src/templates/assets/v2/t02-professional-cv-design_modern.html',
    supportedSections: ["photo","skills","languages","summary","experience","education","achievements","projects"],
    capabilities: { nativeContract: true, v1VisualEquivalence: 'pending', browserMeasurement: 'pending', paginationEvidence: 'pending', exportEvidence: 'pending' }
  },
  {
    id: 't03-professional-cv-design_modern',
    name: 'T03 Professional CV — Native V2',
    version: '2.0.0',
    status: V2_NATIVE_TEMPLATE_STATUS.SOURCE_CONVERTED,
    compatibility: V2_NATIVE_TEMPLATE_STATUS.VALIDATION_PENDING,
    v1BaselineId: 't03-professional-cv-design_modern',
    sourcePath: 'src/templates/assets/v2/t03-professional-cv-design_modern.html',
    supportedSections: ["photo","summary","education","experience","projects","skills","languages","achievements"],
    capabilities: { nativeContract: true, v1VisualEquivalence: 'pending', browserMeasurement: 'pending', paginationEvidence: 'pending', exportEvidence: 'pending' }
  },
  {
    id: 't04-modern-blue-corporate_modern',
    name: 'T04 Modern Blue Corporate — Native V2',
    version: '2.0.0',
    status: V2_NATIVE_TEMPLATE_STATUS.SOURCE_CONVERTED,
    compatibility: V2_NATIVE_TEMPLATE_STATUS.VALIDATION_PENDING,
    v1BaselineId: 't04-modern-blue-corporate_modern',
    sourcePath: 'src/templates/assets/v2/t04-modern-blue-corporate_modern.html',
    supportedSections: ["summary","photo","experience","education","projects","skills","languages","achievements"],
    capabilities: { nativeContract: true, v1VisualEquivalence: 'pending', browserMeasurement: 'pending', paginationEvidence: 'pending', exportEvidence: 'pending' }
  },
  {
    id: 't05-simple-cv-graphic-web-designer_modern',
    name: 'T05 Simple CV Graphic Web Designer — Native V2',
    version: '2.0.0',
    status: V2_NATIVE_TEMPLATE_STATUS.SOURCE_CONVERTED,
    compatibility: V2_NATIVE_TEMPLATE_STATUS.VALIDATION_PENDING,
    v1BaselineId: 't05-simple-cv-graphic-web-designer_modern',
    sourcePath: 'src/templates/assets/v2/t05-simple-cv-graphic-web-designer_modern.html',
    supportedSections: ["photo","summary","skills","languages","education","experience","projects"],
    capabilities: { nativeContract: true, v1VisualEquivalence: 'pending', browserMeasurement: 'pending', paginationEvidence: 'pending', exportEvidence: 'pending' }
  },
  {
    id: 't06-professional-cv-graphic-designer_modern',
    name: 'T06 Professional CV Graphic Designer — Native V2',
    version: '2.0.0',
    status: V2_NATIVE_TEMPLATE_STATUS.SOURCE_CONVERTED,
    compatibility: V2_NATIVE_TEMPLATE_STATUS.VALIDATION_PENDING,
    v1BaselineId: 't06-professional-cv-graphic-designer_modern',
    sourcePath: 'src/templates/assets/v2/t06-professional-cv-graphic-designer_modern.html',
    supportedSections: ["photo","skills","achievements","languages","summary","education","experience"],
    capabilities: { nativeContract: true, v1VisualEquivalence: 'pending', browserMeasurement: 'pending', paginationEvidence: 'pending', exportEvidence: 'pending' }
  },
  {
    id: 't07-professional-cv-store-manager-incharge_modern',
    name: 'T07 Professional CV Store Manager/Incharge — Native V2',
    version: '2.0.0',
    status: V2_NATIVE_TEMPLATE_STATUS.SOURCE_CONVERTED,
    compatibility: V2_NATIVE_TEMPLATE_STATUS.VALIDATION_PENDING,
    v1BaselineId: 't07-professional-cv-store-manager-incharge_modern',
    sourcePath: 'src/templates/assets/v2/t07-professional-cv-store-manager-incharge_modern.html',
    supportedSections: ["photo","summary","experience","education","skills","languages"],
    capabilities: { nativeContract: true, v1VisualEquivalence: 'pending', browserMeasurement: 'pending', paginationEvidence: 'pending', exportEvidence: 'pending' }
  }
];

export function createV2NativeTemplateCatalog() {
  return nativeTemplates.map(template => createTemplateDefinition(template));
}

export function listNativeV2Templates() {
  return nativeTemplates.map(template => Object.freeze({ ...template, supportedSections: [...template.supportedSections], capabilities: { ...template.capabilities } }));
}

export function getNativeV2Template(id) {
  const found = nativeTemplates.find(template => template.id === String(id));
  return found ? Object.freeze({ ...found, supportedSections: [...found.supportedSections], capabilities: { ...found.capabilities } }) : null;
}

export const V2_NATIVE_TEMPLATE_IDS = Object.freeze(nativeTemplates.map(template => template.id));
