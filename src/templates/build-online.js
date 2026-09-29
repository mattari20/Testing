import { getTemplateLibraryEntry } from './template-library.js';
import { PREVIEW_MODE } from './template-preview.js';

export const BUILD_ONLINE_VERSION = '1.0.0';

export function createBuildOnlineRequest(templateId, options = {}) {
  const template = getTemplateLibraryEntry(templateId, options.templates);
  if (!template) throw new Error('Template not found: ' + templateId);
  const mode = options.mode || 'new';
  if (!['new','master-profile','existing-cv','demo'].includes(mode)) throw new Error('Unsupported Build Online mode: ' + mode);
  if (mode === 'master-profile' && !options.masterProfileId) throw new Error('masterProfileId is required.');
  if (mode === 'existing-cv' && !options.targetedCVId) throw new Error('targetedCVId is required.');
  return Object.freeze({
    buildOnlineVersion: BUILD_ONLINE_VERSION,
    templateId: template.id,
    templateVersion: template.version,
    mode,
    masterProfileId: options.masterProfileId || null,
    targetedCVId: options.targetedCVId || null,
    demoProfileId: mode === 'demo' ? String(options.demoProfileId || 'demo-profile') : null,
    compatibilityReviewRequired: true,
    canonicalDataMutation: false
  });
}

export function validateBuildOnlineRequest(request) {
  const errors = [];
  if (!request?.templateId) errors.push('templateId is required.');
  if (request?.mode === 'master-profile' && !request.masterProfileId) errors.push('masterProfileId is required.');
  if (request?.mode === 'existing-cv' && !request.targetedCVId) errors.push('targetedCVId is required.');
  if (request?.canonicalDataMutation !== false) errors.push('Build Online must not mutate canonical data.');
  return { valid: errors.length === 0, errors };
}
