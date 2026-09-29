import { getTemplateLibraryEntry } from './template-library.js';

export const TEMPLATE_PREVIEW_VERSION = '1.0.0';

export const PREVIEW_MODE = Object.freeze({
  DEMO: 'demo',
  MY_DATA: 'my-data'
});

export function createDemoProfile(input = {}) {
  return Object.freeze({
    id: String(input.id || 'demo-profile'),
    kind: 'demo',
    label: String(input.label || 'Demo Profile'),
    careerLevel: input.careerLevel || 'Fresh Graduate',
    identity: { fullName: 'Alex Morgan', jobTitle: 'Software Engineer', ...(input.identity || {}) },
    sections: Array.isArray(input.sections) ? input.sections.map(section => ({ ...section })) : [],
    privateData: false
  });
}

export function createTemplatePreviewRequest(templateId, options = {}) {
  const entry = getTemplateLibraryEntry(templateId, options.templates);
  if (!entry) throw new Error('Template not found: ' + templateId);
  const mode = options.mode || PREVIEW_MODE.DEMO;
  if (!Object.values(PREVIEW_MODE).includes(mode)) throw new Error('Unsupported preview mode: ' + mode);
  return Object.freeze({
    previewVersion: TEMPLATE_PREVIEW_VERSION,
    templateId: entry.id,
    templateVersion: entry.version,
    mode,
    demoProfileId: mode === PREVIEW_MODE.DEMO ? String(options.demoProfileId || 'demo-profile') : null,
    masterProfileId: mode === PREVIEW_MODE.MY_DATA ? String(options.masterProfileId || '') : null,
    privateDataAuthorized: mode === PREVIEW_MODE.MY_DATA ? options.privateDataAuthorized === true : false,
    fullPage: options.fullPage !== false,
    provenance: Object.freeze({
      source: mode === PREVIEW_MODE.DEMO ? 'controlled-demo-profile' : 'authorized-master-profile'
    })
  });
}

export function validateTemplatePreviewRequest(request) {
  const errors = [];
  if (!request || !request.templateId) errors.push('templateId is required.');
  if (!request || !Object.values(PREVIEW_MODE).includes(request.mode)) errors.push('preview mode is invalid.');
  if (request?.mode === PREVIEW_MODE.DEMO && request.privateDataAuthorized) errors.push('Demo preview cannot authorize private data.');
  if (request?.mode === PREVIEW_MODE.MY_DATA && !request.privateDataAuthorized) errors.push('My Data preview requires explicit private-data authorization.');
  if (request?.mode === PREVIEW_MODE.MY_DATA && !request.masterProfileId) errors.push('masterProfileId is required for My Data preview.');
  return { valid: errors.length === 0, errors };
}
