import { listNativeV2Templates } from './v2-native-template-catalog.js';
import { TEMPLATE_STATUS } from './template-engine.js';
import { buildTemplateOnboardingRecord } from './template-onboarding.js';

export const TEMPLATE_LIBRARY_VERSION = '1.0.0';

const clone = value => JSON.parse(JSON.stringify(value));

function normalizeList(value) {
  return Array.isArray(value) ? [...new Set(value.map(String))] : [];
}

function matchesList(template, key, requested) {
  if (!requested || requested.length === 0) return true;
  const values = normalizeList(template[key]);
  return requested.some(value => values.includes(String(value)));
}

function getOutput(template, key) {
  return Boolean(template.outputs && template.outputs[key] === true);
}

export function createTemplateLibraryEntry(template) {
  const onboarding = buildTemplateOnboardingRecord(template);
  return Object.freeze({
    id: template.id,
    name: template.name,
    version: template.version,
    status: template.status || TEMPLATE_STATUS.DRAFT,
    careerLevel: normalizeList(template.careerLevel),
    industry: normalizeList(template.industry),
    style: normalizeList(template.style),
    supportedSections: normalizeList(template.supportedSections),
    supportedVariants: normalizeList(template.supportedVariants),
    outputs: {
      web: getOutput(template, 'web'),
      pdf: getOutput(template, 'pdf'),
      print: getOutput(template, 'print'),
      docx: getOutput(template, 'docx'),
      blankDocx: getOutput(template, 'blankDocx'),
      onlineCV: getOutput(template, 'onlineCV'),
      samplePdf: getOutput(template, 'samplePdf')
    },
    photo: clone(template.photo || {}),
    ats: clone(template.ats || {}),
    accessibility: clone(template.accessibility || {}),
    commercial: clone(template.commercial || {}),
    discovery: clone(template.discovery || {}),
    demo: clone(template.demo || {}),
    onboardingStatus: onboarding.status
  });
}

export function listTemplateLibraryEntries(templates = listNativeV2Templates(), options = {}) {
  const source = templates.map(createTemplateLibraryEntry);
  const status = options.status;
  const careerLevel = normalizeList(options.careerLevel);
  const industry = normalizeList(options.industry);
  const style = normalizeList(options.style);

  return source.filter(template => {
    if (status && template.status !== status) return false;
    if (!matchesList(template, 'careerLevel', careerLevel)) return false;
    if (!matchesList(template, 'industry', industry)) return false;
    if (!matchesList(template, 'style', style)) return false;
    if (options.free === true && template.commercial?.access !== 'free') return false;
    if (options.premium === true && template.commercial?.access !== 'premium') return false;
    if (options.docx === true && !template.outputs.docx) return false;
    if (options.blankDocx === true && !template.outputs.blankDocx) return false;
    if (options.onlineCV === true && !template.outputs.onlineCV) return false;
    if (options.photo === true && template.photo?.supported !== true) return false;
    return true;
  });
}

export function getTemplateLibraryEntry(id, templates = listNativeV2Templates()) {
  const template = templates.find(item => item.id === String(id));
  return template ? createTemplateLibraryEntry(template) : null;
}

export function createTemplateLibraryPlan(templates = listNativeV2Templates()) {
  const entries = listTemplateLibraryEntries(templates);
  return Object.freeze({
    libraryVersion: TEMPLATE_LIBRARY_VERSION,
    templateCount: entries.length,
    publishedCount: entries.filter(item => item.status === TEMPLATE_STATUS.PUBLISHED).length,
    freeCount: entries.filter(item => item.commercial?.access === 'free').length,
    premiumCount: entries.filter(item => item.commercial?.access === 'premium').length,
    entries: Object.freeze(entries)
  });
}
