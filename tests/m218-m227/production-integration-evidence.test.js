import test from 'node:test';
import assert from 'node:assert/strict';

import {
  PRODUCTION_INTEGRATION_REQUIREMENTS,
  createProductionIntegrationEvidence,
  validateProductionIntegrationEvidence
} from '../../src/release/production-integration-evidence.js';

test('M218-M227 evidence contract requires every production gate', () => {
  const evidence = createProductionIntegrationEvidence();

  assert.equal(PRODUCTION_INTEGRATION_REQUIREMENTS.length, 9);
  assert.equal(validateProductionIntegrationEvidence(evidence).valid, false);

  const result = validateProductionIntegrationEvidence(evidence);
  for (const requirement of PRODUCTION_INTEGRATION_REQUIREMENTS) {
    assert.ok(result.errors.some((error) => error.includes(requirement)));
  }
});

test('M218-M227 evidence contract accepts a complete observed record', () => {
  const evidence = createProductionIntegrationEvidence({
    productionUrl: 'https://example.test/cv-builder/',
    deploymentCommitSha: '0123456789abcdef0123456789abcdef01234567',
    environment: 'production',
    observedAt: '2026-09-30T00:00:00Z',
    productionEntrypointLoadsV2: true,
    realCvCreateEdit: true,
    templateSelectionAndLivePreview: true,
    multiPagePaginationAndFragmentation: true,
    pdfPrintAndDocxExport: true,
    v1DataOrMigrationPath: true,
    noUnexpectedV1Fallback: true,
    noPlaintextProductionCredentials: true,
    smokeTestMetadata: true
  });

  assert.deepEqual(validateProductionIntegrationEvidence(evidence), {
    valid: true,
    errors: []
  });
});
