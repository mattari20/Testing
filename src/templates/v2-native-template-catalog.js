import { CAPABILITY, TEMPLATE_STATUS, createTemplateDefinition } from './template-engine.js';

export const V2_NATIVE_TEMPLATE_STATUS = Object.freeze({
  CONVERSION_READY: 'conversion-ready',
  VALIDATION_PENDING: 'validation-pending',
  COMPATIBLE: 'v2-compatible'
});

const nativeTemplates = [
  {
    id: 't01-modern-minimalist-cv-design_modern',
    name: 'T01 Modern Minimalist CV — Native V2',
    version: '2.0.0',
    sourceLineage: 'v1-golden-baseline:t01-modern-minimalist-cv-design_modern',
    sourcePath: 'src/templates/assets/v2/t01-modern-minimalist-cv-design_modern.html',
    status: TEMPLATE_STATUS.TESTING,
    supportedSections: ['summary','experience','education','skills','languages','photo'],
    supportedFields: ['identity.fullName','identity.jobTitle','identity.phone','identity.whatsapp','identity.email','identity.address','identity.linkedin','identity.website','identity.dateOfBirth','identity.cnic','identity.religion','section:summary:text'],
    supportedFieldTypes: ['text','url','date'],
    supportedVariants: [],
    capabilities: {
      'personal.identity': CAPABILITY.SUPPORTED,
      'summary': CAPABILITY.SUPPORTED,
      'education': CAPABILITY.SUPPORTED,
      'experience': CAPABILITY.SUPPORTED,
      'skills': CAPABILITY.SUPPORTED,
      'languages': CAPABILITY.SUPPORTED,
      'photo': CAPABILITY.SUPPORTED,
      'pagination.a4': CAPABILITY.CONSTRAINED,
      'projects': CAPABILITY.UNKNOWN,
      'achievements': CAPABILITY.UNKNOWN,
      'theme': CAPABILITY.SUPPORTED
    },
    outputs: { web: true, pdf: false, print: false, docx: false, blankDocx: false, onlineCV: false, samplePdf: false },
    pageModel: { width: '210mm', minHeight: '297mm', orientation: 'portrait', columns: 2 },
    compatibility: {
      nativeContract: true,
      v1VisualEquivalence: 'pending',
      browserMeasurement: 'pending',
      paginationEvidence: 'pending',
      exportEvidence: 'pending'
    },
    assets: { templatePath: 'src/templates/assets/v2/t01-modern-minimalist-cv-design_modern.html' }
  }
];

export function createV2NativeTemplateCatalog() {
  return nativeTemplates.map(template => createTemplateDefinition(template));
}

export const V2_NATIVE_TEMPLATE_IDS = Object.freeze(nativeTemplates.map(template => template.id));
