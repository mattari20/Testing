export const WORD_TEMPLATE_CATALOG_VERSION = '1.0.0';

export const WORD_TEMPLATE_STATUS = Object.freeze({
  PLANNED: 'planned',
  READY: 'ready',
  BLOCKED: 'blocked'
});

const WORD_TEMPLATES = Object.freeze([
  ['t01-modern-minimalist-cv-design_modern','T01 Modern Minimalist CV','T01-Modern-Minimalist-CV-Template.docx'],
  ['t02-professional-cv-design_modern','T02 Professional CV','T02-Professional-CV-Template.docx'],
  ['t03-professional-cv-design_modern','T03 Professional CV','T03-Professional-CV-Template.docx'],
  ['t04-modern-blue-corporate_modern','T04 Modern Blue Corporate CV','T04-Modern-Blue-Corporate-CV-Template.docx'],
  ['t05-simple-cv-graphic-web-designer_modern','T05 Graphic & Web Designer CV','T05-Graphic-Web-Designer-CV-Template.docx'],
  ['t06-professional-cv-graphic-designer_modern','T06 Professional Graphic Designer CV','T06-Professional-Graphic-Designer-CV-Template.docx'],
  ['t07-professional-cv-store-manager-incharge_modern','T07 Store Manager CV','T07-Store-Manager-CV-Template.docx']
].map(([templateId,name,fileName]) => Object.freeze({
  templateId,
  name,
  fileName,
  relativePath: 'public/cv-builder/word-templates/' + fileName,
  status: WORD_TEMPLATE_STATUS.PLANNED,
  editable: true,
  containsDemoData: true,
  requiresLogin: false
})));

export function listWordTemplates() {
  return WORD_TEMPLATES.map(item => Object.freeze({ ...item }));
}

export function getWordTemplate(templateId) {
  const found = WORD_TEMPLATES.find(item => item.templateId === String(templateId));
  return found ? Object.freeze({ ...found }) : null;
}

export function createWordTemplateDownloadRequest(templateId) {
  const template = getWordTemplate(templateId);
  if (!template) throw new Error('Word template not found: ' + templateId);
  return Object.freeze({
    catalogVersion: WORD_TEMPLATE_CATALOG_VERSION,
    templateId: template.templateId,
    fileName: template.fileName,
    path: template.relativePath,
    status: template.status,
    editable: template.editable,
    containsDemoData: template.containsDemoData,
    requiresLogin: template.requiresLogin
  });
}

export function validateWordTemplateCatalog() {
  const errors = [];
  const ids = new Set();
  for (const template of WORD_TEMPLATES) {
    if (ids.has(template.templateId)) errors.push('Duplicate templateId: ' + template.templateId);
    ids.add(template.templateId);
    if (!template.fileName.endsWith('.docx')) errors.push('Invalid DOCX filename: ' + template.fileName);
    if (!template.relativePath.includes('/word-templates/')) errors.push('Invalid Word template path: ' + template.relativePath);
    if (template.editable !== true) errors.push('Word template must be editable: ' + template.templateId);
    if (template.requiresLogin !== false) errors.push('Word template must be no-login: ' + template.templateId);
  }
  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze(errors), count: WORD_TEMPLATES.length });
}
