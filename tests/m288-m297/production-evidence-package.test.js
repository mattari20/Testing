import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createProductionEvidencePackage,
  validateProductionEvidencePackage
} from '../../src/release/production-evidence-package.js';

function completeSmokeRecord() {
  return {
    recordVersion: '1.0.0',
    productionUrl: 'https://example.com/cv-builder/',
    deploymentCommitSha: '0123456789abcdef0123456789abcdef01234567',
    environment: 'production',
    observedAt: '2026-09-30T15:00:00+05:00',
    observations: {
      v2Entrypoint: true,
      cvCreated: true,
      cvEdited: true,
      templateSelected: true,
      livePreviewUpdated: true,
      multiPagePagination: true,
      fragmentContinuation: true,
      pdfPrintExport: true,
      docxExport: true,
      v1DataOrMigrationVerified: true,
      noUnexpectedV1Fallback: true,
      productionConfigReviewed: true,
      noPlaintextCredentials: true,
      evidenceReferencesRecorded: true
    },
    evidenceReferences: ['operator-observation-001']
  };
}

test('incomplete production evidence remains explicitly OPEN', () => {
  const pkg = createProductionEvidencePackage({
    smokeRecord: completeSmokeRecord(),
    productionSourceBridgeState: 'v1',
    evidenceReferences: ['browser-run-001']
  });

  assert.equal(pkg.r6, 'OPEN');
  assert.equal(pkg.packageStatus, 'evidence-incomplete');
  assert.equal(validateProductionEvidencePackage(pkg).valid, true);
});

test('complete smoke evidence plus explicit V2 bridge becomes ready for acceptance', () => {
  const pkg = createProductionEvidencePackage({
    smokeRecord: completeSmokeRecord(),
    productionSourceBridgeState: 'v2',
    evidenceReferences: ['browser-run-001', 'operator-check-001']
  });

  assert.equal(pkg.r6, 'PASS');
  assert.equal(pkg.packageStatus, 'ready-for-acceptance');
  assert.equal(pkg.validationReasons.length, 0);
  assert.equal(validateProductionEvidencePackage(pkg).valid, true);
});

test('secret-like keys are rejected rather than serialized into the evidence package', () => {
  assert.throws(
    () => createProductionEvidencePackage({
      smokeRecord: { recordVersion: '1.0.0', apiKey: 'must-not-appear' },
      productionSourceBridgeState: 'v1'
    }),
    /secret-like keys/i
  );
});

test('invalid package states are rejected', () => {
  const result = validateProductionEvidencePackage({
    packageVersion: '1.0.0',
    packageStatus: 'unknown',
    r6: 'OPEN',
    productionSourceBridgeState: 'v1',
    smokeRecord: {},
    evidenceReferences: []
  });

  assert.equal(result.valid, false);
  assert.match(result.errors.join(' '), /packageStatus/i);
});
