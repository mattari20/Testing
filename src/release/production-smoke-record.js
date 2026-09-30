import {
  PRODUCTION_INTEGRATION_REQUIREMENTS,
  createProductionIntegrationEvidence,
  validateProductionIntegrationEvidence
} from './production-integration-evidence.js';

export const PRODUCTION_SMOKE_RECORD_VERSION = '1.0.0';

export const PRODUCTION_SMOKE_OBSERVATIONS = Object.freeze({
  productionEntrypointLoadsV2: ['v2Entrypoint'],
  realCvCreateEdit: ['cvCreated', 'cvEdited'],
  templateSelectionAndLivePreview: ['templateSelected', 'livePreviewUpdated'],
  multiPagePaginationAndFragmentation: ['multiPagePagination', 'fragmentContinuation'],
  pdfPrintAndDocxExport: ['pdfPrintExport', 'docxExport'],
  v1DataOrMigrationPath: ['v1DataOrMigrationVerified'],
  noUnexpectedV1Fallback: ['noUnexpectedV1Fallback'],
  noPlaintextProductionCredentials: ['productionConfigReviewed', 'noPlaintextCredentials'],
  smokeTestMetadata: ['evidenceReferencesRecorded']
});

export function validateProductionSmokeRecord(record) {
  const errors = [];
  if (record?.recordVersion !== PRODUCTION_SMOKE_RECORD_VERSION) {
    errors.push('Unsupported production smoke record version.');
  }
  const observations = record?.observations;
  if (!observations || typeof observations !== 'object' || Array.isArray(observations)) {
    errors.push('observations must be an object.');
  }
  for (const [gate, checks] of Object.entries(PRODUCTION_SMOKE_OBSERVATIONS)) {
    for (const check of checks) {
      if (observations?.[check] !== true) errors.push(gate + ': ' + check + ' must be explicitly observed as true.');
    }
  }
  const refs = record?.evidenceReferences;
  if (!Array.isArray(refs) || refs.length === 0 || refs.some(ref => typeof ref !== 'string' || !ref.trim())) {
    errors.push('At least one nonempty, non-secret evidence reference is required.');
  }
  const integration = createProductionIntegrationEvidence({
    productionUrl: record?.productionUrl,
    deploymentCommitSha: record?.deploymentCommitSha,
    environment: record?.environment,
    observedAt: record?.observedAt,
    ...Object.fromEntries(PRODUCTION_INTEGRATION_REQUIREMENTS.map(gate => [
      gate,
      PRODUCTION_SMOKE_OBSERVATIONS[gate].every(check => observations?.[check] === true)
    ]))
  });
  const integrationResult = validateProductionIntegrationEvidence(integration);
  errors.push(...integrationResult.errors);
  if (record?.environment !== 'production') errors.push('environment must be production for R6.');
  if (typeof record?.productionUrl !== 'string' || !/^https:\/\/[^\s/]+(?:\/[^\s]*)?$/i.test(record.productionUrl)) {
    errors.push('productionUrl must be an HTTPS URL.');
  }
  if (typeof record?.deploymentCommitSha !== 'string' || !/^[a-f0-9]{40}$/i.test(record.deploymentCommitSha)) {
    errors.push('deploymentCommitSha must be a full 40-character Git SHA.');
  }
  if (typeof record?.observedAt !== 'string' || !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?(?:Z|[+-]\d\d:\d\d)$/.test(record.observedAt) || Number.isNaN(Date.parse(record.observedAt))) {
    errors.push('observedAt must be a valid offset-aware ISO-8601 timestamp.');
  }
  return Object.freeze({
    valid: errors.length === 0,
    errors: Object.freeze([...new Set(errors)]),
    integrationEvidence: integration
  });
}
