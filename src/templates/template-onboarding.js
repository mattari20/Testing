import { listNativeV2Templates } from './v2-native-template-catalog.js';

export const TEMPLATE_ONBOARDING_VERSION = '1.0.0';

export const ONBOARDING_STATUS = Object.freeze({
  READY: 'ready',
  BLOCKED: 'blocked'
});

const REQUIRED_FIELDS = [
  'id',
  'name',
  'version',
  'sourcePath',
  'supportedSections',
  'capabilities'
];

const REQUIRED_CAPABILITIES = [
  'nativeContract',
  'browserMeasurement',
  'paginationEvidence'
];

function clone(value) {
  return value && typeof value === 'object'
    ? JSON.parse(JSON.stringify(value))
    : value;
}

export function validateTemplateDefinition(template) {
  const errors = [];
  const warnings = [];
  const candidate = template || {};

  for (const field of REQUIRED_FIELDS) {
    if (candidate[field] === undefined || candidate[field] === null || candidate[field] === '') {
      errors.push('Missing required field: ' + field);
    }
  }

  if (!Array.isArray(candidate.supportedSections)) {
    errors.push('supportedSections must be an array');
  }

  if (!candidate.capabilities || typeof candidate.capabilities !== 'object') {
    errors.push('capabilities must be an object');
  } else {
    for (const capability of REQUIRED_CAPABILITIES) {
      if (candidate.capabilities[capability] === undefined) {
        errors.push('Missing capability declaration: ' + capability);
      }
    }
  }

  if (candidate.status === 'published' && candidate.compatibility !== 'v2-compatible') {
    errors.push('Published templates must declare v2-compatible compatibility');
  }

  if (!candidate.v1BaselineId && candidate.v1BaselineId !== null) {
    warnings.push('No V1 baseline is declared; this is valid for V2-native templates.');
  }

  return Object.freeze({
    valid: errors.length === 0,
    errors: Object.freeze(errors),
    warnings: Object.freeze(warnings)
  });
}

export function buildTemplateOnboardingRecord(template) {
  const validation = validateTemplateDefinition(template);
  const capabilities = clone((template && template.capabilities) || {});

  const readiness = {
    metadata: validation.valid,
    nativeContract: capabilities.nativeContract === true,
    browserMeasurement: capabilities.browserMeasurement === 'passed',
    paginationEvidence: capabilities.paginationEvidence === 'passed',
    exportEvidence: capabilities.exportEvidence === 'passed'
  };

  const evidenceComplete =
    readiness.metadata &&
    readiness.nativeContract &&
    readiness.browserMeasurement &&
    readiness.paginationEvidence;

  return Object.freeze({
    onboardingVersion: TEMPLATE_ONBOARDING_VERSION,
    templateId: (template && template.id) || null,
    templateVersion: (template && template.version) || null,
    status: evidenceComplete ? ONBOARDING_STATUS.READY : ONBOARDING_STATUS.BLOCKED,
    validation,
    readiness: Object.freeze(readiness),
    sourcePath: (template && template.sourcePath) || null,
    v1BaselineId: template && template.v1BaselineId !== undefined ? template.v1BaselineId : null
  });
}

export function createNativeTemplateOnboardingPlan(templates = listNativeV2Templates()) {
  const records = templates.map(buildTemplateOnboardingRecord);
  return Object.freeze({
    onboardingVersion: TEMPLATE_ONBOARDING_VERSION,
    templateCount: records.length,
    readyCount: records.filter(record => record.status === ONBOARDING_STATUS.READY).length,
    blockedCount: records.filter(record => record.status === ONBOARDING_STATUS.BLOCKED).length,
    records: Object.freeze(records)
  });
}

export function assertTemplateCanBePublished(template) {
  const record = buildTemplateOnboardingRecord(template);
  if (record.status !== ONBOARDING_STATUS.READY) {
    const reasons = [
      ...record.validation.errors,
      ...Object.entries(record.readiness)
        .filter(([, passed]) => passed === false)
        .map(([key]) => 'Missing onboarding evidence: ' + key)
    ];
    throw new Error('Template cannot be published: ' + reasons.join('; '));
  }
  return record;
}
