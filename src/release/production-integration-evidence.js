export const PRODUCTION_INTEGRATION_EVIDENCE_VERSION = '1.0.0';

export const PRODUCTION_INTEGRATION_REQUIREMENTS = Object.freeze([
  'productionEntrypointLoadsV2',
  'realCvCreateEdit',
  'templateSelectionAndLivePreview',
  'multiPagePaginationAndFragmentation',
  'pdfPrintAndDocxExport',
  'v1DataOrMigrationPath',
  'noUnexpectedV1Fallback',
  'noPlaintextProductionCredentials',
  'smokeTestMetadata'
]);

export function createProductionIntegrationEvidence(input = {}) {
  return Object.freeze({
    evidenceVersion: PRODUCTION_INTEGRATION_EVIDENCE_VERSION,
    ...Object.fromEntries(
      PRODUCTION_INTEGRATION_REQUIREMENTS.map((key) => [key, input[key] === true])
    ),
    productionUrl: input.productionUrl || null,
    deploymentCommitSha: input.deploymentCommitSha || null,
    environment: input.environment || null,
    observedAt: input.observedAt || null
  });
}

export function validateProductionIntegrationEvidence(evidence) {
  const errors = [];

  if (evidence?.evidenceVersion !== PRODUCTION_INTEGRATION_EVIDENCE_VERSION) {
    errors.push('Unsupported production integration evidence version.');
  }

  for (const key of PRODUCTION_INTEGRATION_REQUIREMENTS) {
    if (evidence?.[key] !== true) {
      errors.push(key + ' must be explicitly evidenced as true.');
    }
  }

  if (!evidence?.productionUrl) errors.push('productionUrl is required.');
  if (!evidence?.deploymentCommitSha) errors.push('deploymentCommitSha is required.');
  if (!evidence?.environment) errors.push('environment is required.');
  if (!evidence?.observedAt) errors.push('observedAt is required.');

  return Object.freeze({
    valid: errors.length === 0,
    errors
  });
}
