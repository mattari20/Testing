import { createMasterProfile, createTargetedCV, createDocumentSnapshot, validateM1, M1_SCHEMA_VERSION } from '../core/career-document-core.js';

export const IMPORT_ENGINE_VERSION = '1.0.0';

export const SOURCE_TYPE = Object.freeze({
  V1_NATIVE: 'v1-native',
  STRUCTURED: 'structured',
  PDF: 'pdf',
  DOCX: 'docx',
  EXTERNAL_PROFILE: 'external-profile'
});

export const REVIEW_STATE = Object.freeze({
  IMPORTED: 'imported',
  NEEDS_REVIEW: 'needs-review',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  PARTIALLY_ACCEPTED: 'partially-accepted',
  UNRESOLVED: 'unresolved'
});

export const LOSS_CLASS = Object.freeze({
  NONE: 'no-loss',
  REPRESENTATIONAL: 'representational-change',
  USER_REJECTED: 'explicit-user-rejection',
  PRESERVED: 'unsupported-but-preserved',
  UNRESOLVED: 'unresolved',
  ERROR: 'loss-error'
});

const clone = value => JSON.parse(JSON.stringify(value));
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const arr = value => Array.isArray(value) ? value : [];
const text = value => value == null ? '' : String(value);

function fingerprint(value) {
  return JSON.stringify(value);
}

function makeSection(id, type, title, fields = [], entries = [], repeatable = false, metadata = {}) {
  return { id, type, title, visibility: true, order: 0, fields, entries, repeatable, metadata };
}

function makeField(id, label, value, metadata = {}) {
  return { id, type: 'text', label, value: value == null ? '' : clone(value), visibility: true, order: 0, metadata };
}

function makeEntry(id, values, order, metadata = {}) {
  return { id, values: clone(values), visibility: true, order, metadata };
}

function mapV1Array(items, prefix, mapper) {
  return arr(items).map((item, index) => makeEntry(
    prefix + '_' + String(index + 1).padStart(3, '0'),
    mapper(item || {}, index),
    index,
    { source: 'v1-native', sourceIndex: index }
  ));
}

export function detectSource(input = {}) {
  if (isObject(input) && (input.windowCV || input.cv || input.cvVisibility || input.legacyKey === 'cvData' || input.legacyKey === 'cv_estudent_v2_final')) {
    return { sourceType: SOURCE_TYPE.V1_NATIVE, schemaVersion: text(input.schemaVersion || 'v1-unknown'), confidence: 'high' };
  }
  if (input.fileType === 'application/pdf' || String(input.format || '').toLowerCase() === 'pdf') {
    return { sourceType: SOURCE_TYPE.PDF, schemaVersion: null, confidence: 'variable' };
  }
  if (input.fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || String(input.format || '').toLowerCase() === 'docx') {
    return { sourceType: SOURCE_TYPE.DOCX, schemaVersion: null, confidence: 'variable' };
  }
  if (isObject(input.data)) return { sourceType: SOURCE_TYPE.STRUCTURED, schemaVersion: text(input.schemaVersion || 'unknown'), confidence: 'high' };
  return { sourceType: SOURCE_TYPE.EXTERNAL_PROFILE, schemaVersion: text(input.schemaVersion || 'unknown'), confidence: 'variable' };
}

export function normalizeV1Source(input = {}) {
  const cv = clone(input.windowCV || input.cv || {});
  const visibility = clone(input.windowCVVisibility || input.cvVisibility || {});
  return {
    sourceType: SOURCE_TYPE.V1_NATIVE,
    sourceSchemaVersion: text(input.schemaVersion || 'v1-unknown'),
    legacyKey: input.legacyKey || null,
    cv,
    visibility,
    themeColor: input.themeColor || cv.themeColor || null,
    templateId: input.templateId || cv.templateId || null,
    migrationSourceFingerprint: fingerprint({ cv, visibility, themeColor: input.themeColor || null, templateId: input.templateId || null })
  };
}

export function migrateV1ToV2(input = {}) {
  const source = normalizeV1Source(input);
  const cv = source.cv;
  const personal = isObject(cv.personal) ? cv.personal : {};
  const sections = [];

  sections.push(makeSection('personal', 'personal', 'Personal Information', [
    makeField('name', 'Name', personal.name),
    makeField('job', 'Job Title', personal.job),
    makeField('email', 'Email', personal.email),
    makeField('phone', 'Phone', personal.phone),
    makeField('whatsapp', 'WhatsApp', personal.whatsapp),
    makeField('address', 'Address', personal.address),
    makeField('dob', 'Date of Birth', personal.dob),
    makeField('cnic', 'National ID', personal.cnic, { regional: true }),
    makeField('religion', 'Religion', personal.religion, { regional: true }),
    makeField('linkedin', 'LinkedIn', personal.linkedin),
    makeField('website', 'Website', personal.website)
  ]));

  sections.push(makeSection('summary', 'summary', 'Professional Summary', [
    makeField('summary_text', 'Summary', cv.summary)
  ]));

  sections.push(makeSection('education', 'education', 'Education', mapV1Array(cv.education, 'education', (item) => ({
    institution: item.institution || item.school || '',
    degree: item.degree || item.qualification || '',
    field: item.field || item.subject || '',
    startDate: item.startDate || item.start || '',
    endDate: item.endDate || item.end || '',
    description: item.description || ''
  })), [], true));

  sections.push(makeSection('experience', 'experience', 'Experience', mapV1Array(cv.experience, 'experience', (item) => ({
    employer: item.employer || item.company || '',
    role: item.role || item.title || '',
    startDate: item.startDate || item.start || '',
    endDate: item.endDate || item.end || '',
    description: item.description || ''
  })), [], true));

  sections.push(makeSection('projects', 'projects', 'Projects', mapV1Array(cv.projects, 'project', (item) => ({
    name: item.name || item.title || '',
    description: item.description || '',
    url: item.url || item.link || ''
  })), [], true));

  sections.push(makeSection('skills', 'skills', 'Skills', mapV1Array(cv.skills, 'skill', (item) => ({
    name: typeof item === 'string' ? item : (item.name || item.skill || ''),
    level: typeof item === 'string' ? '' : (item.level || '')
  })), [], true));

  sections.push(makeSection('languages', 'languages', 'Languages', mapV1Array(cv.languages, 'language', (item) => ({
    name: typeof item === 'string' ? item : (item.name || item.language || ''),
    proficiency: typeof item === 'string' ? '' : (item.proficiency || item.level || '')
  })), [], true));

  sections.push(makeSection('achievements', 'achievements', 'Achievements', mapV1Array(cv.achievements, 'achievement', (item) => ({
    title: typeof item === 'string' ? item : (item.title || item.name || ''),
    description: typeof item === 'string' ? '' : (item.description || '')
  })), [], true));

  sections.forEach((section, index) => { section.order = index; });

  const profile = createMasterProfile({
    careerData: {
      identity: {},
      sections,
      assets: cv.photo ? [{ id: 'v1-photo', type: 'profile-photo', source: 'v1-native', value: cv.photo }] : [],
      metadata: {
        migration: {
          sourceType: SOURCE_TYPE.V1_NATIVE,
          sourceSchemaVersion: source.sourceSchemaVersion,
          sourceFingerprint: source.migrationSourceFingerprint,
          engineVersion: IMPORT_ENGINE_VERSION
        }
      }
    }
  });

  const configuration = {
    hiddenSections: [],
    hiddenFields: [],
    hiddenEntries: [],
    presentation: { themeColor: source.themeColor },
    template: source.templateId ? { id: source.templateId, source: 'v1-native', compatibilityPending: true } : null,
    metadata: { migratedFrom: source.legacyKey || 'v1-native' }
  };

  for (const [key, value] of Object.entries(source.visibility || {})) {
    if (value === false && sections.some(s => s.id === key)) configuration.hiddenSections.push(key);
  }

  const fieldKeys = ['name','job','dob','cnic','religion','linkedin','website','whatsapp','phone','email','address'];
  for (const key of fieldKeys) {
    if (source.visibility && source.visibility[key] === false) configuration.hiddenFields.push(key);
  }

  const cvRecord = createTargetedCV({
    masterProfileId: profile.id,
    title: personal.job ? personal.job + ' CV' : 'Migrated CV',
    configuration
  });

  const snapshot = createDocumentSnapshot(profile, cvRecord);
  const validation = validateM1(profile, cvRecord);

  const report = createMigrationReport({
    source,
    validation,
    mappedSections: sections.map(s => s.id),
    mappedEntryCounts: Object.fromEntries(sections.filter(s => s.repeatable).map(s => [s.id, s.entries.length])),
    lossClass: validation.valid ? LOSS_CLASS.NONE : LOSS_CLASS.ERROR,
    unresolved: validation.valid ? [] : validation.profile.errors.concat(validation.targetedCV.errors)
  });

  return { profile, targetedCV: cvRecord, snapshot, report };
}

export function createMigrationReport(input = {}) {
  return {
    engineVersion: IMPORT_ENGINE_VERSION,
    sourceType: input.source?.sourceType || null,
    sourceSchemaVersion: input.source?.sourceSchemaVersion || null,
    sourceFingerprint: input.source?.migrationSourceFingerprint || null,
    mappedSections: arr(input.mappedSections),
    mappedEntryCounts: isObject(input.mappedEntryCounts) ? clone(input.mappedEntryCounts) : {},
    lossClass: input.lossClass || LOSS_CLASS.UNRESOLVED,
    unresolved: arr(input.unresolved),
    validation: clone(input.validation || { valid: false, errors: ['VALIDATION_NOT_RUN'] }),
    completed: input.lossClass !== LOSS_CLASS.ERROR && Boolean(input.validation?.valid),
    createdAt: new Date().toISOString()
  };
}

export function createImportCandidate(input = {}) {
  const detected = detectSource(input);
  return {
    engineVersion: IMPORT_ENGINE_VERSION,
    id: String(input.id || 'import_' + Date.now().toString(36)),
    sourceType: detected.sourceType,
    schemaVersion: detected.schemaVersion,
    confidence: detected.confidence,
    reviewState: REVIEW_STATE.NEEDS_REVIEW,
    provenance: {
      sourceName: input.sourceName || null,
      sourceType: detected.sourceType,
      sourceRegion: input.sourceRegion || null,
      importSessionId: input.importSessionId || null
    },
    extractedData: isObject(input.data) ? clone(input.data) : {},
    unresolved: arr(input.unresolved),
    createdAt: new Date().toISOString()
  };
}

export function acceptImportCandidate(candidate, acceptedData = {}) {
  if (!candidate || candidate.reviewState === REVIEW_STATE.REJECTED) throw new Error('Rejected import candidate cannot be accepted.');
  return {
    ...clone(candidate),
    reviewState: REVIEW_STATE.ACCEPTED,
    acceptedData: clone(acceptedData),
    acceptedAt: new Date().toISOString()
  };
}

export function partiallyAcceptImportCandidate(candidate, acceptedData = {}, rejected = []) {
  if (!candidate) throw new Error('Import candidate is required.');
  return {
    ...clone(candidate),
    reviewState: REVIEW_STATE.PARTIALLY_ACCEPTED,
    acceptedData: clone(acceptedData),
    rejected: arr(rejected),
    acceptedAt: new Date().toISOString()
  };
}

export function classifyLoss(input = {}) {
  if (input.error) return LOSS_CLASS.ERROR;
  if (input.userRejected) return LOSS_CLASS.USER_REJECTED;
  if (input.unresolved) return LOSS_CLASS.UNRESOLVED;
  if (input.unsupportedPreserved) return LOSS_CLASS.PRESERVED;
  if (input.representationalChange) return LOSS_CLASS.REPRESENTATIONAL;
  return LOSS_CLASS.NONE;
}

export function migrationFingerprint(source) {
  const normalized = normalizeV1Source(source);
  return fingerprint({
    cv: normalized.cv,
    visibility: normalized.visibility,
    themeColor: normalized.themeColor,
    templateId: normalized.templateId
  });
}

export function isAlreadyMigrated(source, existingRecords = []) {
  const fp = migrationFingerprint(source);
  return arr(existingRecords).some(record => record?.report?.sourceFingerprint === fp);
}
