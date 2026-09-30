import test from 'node:test';
import assert from 'node:assert/strict';
import { PRODUCTION_SMOKE_OBSERVATIONS, validateProductionSmokeRecord } from '../../src/release/production-smoke-record.js';

const record = () => ({
  recordVersion: '1.0.0',
  productionUrl: 'https://example.test/cv-builder/',
  deploymentCommitSha: '0123456789abcdef0123456789abcdef01234567',
  environment: 'production',
  observedAt: '2026-09-30T08:00:00+05:00',
  observations: Object.fromEntries(Object.values(PRODUCTION_SMOKE_OBSERVATIONS).flat().map(key => [key, true])),
  evidenceReferences: ['synthetic-evidence']
});

test('missing live observations fail', () => {
  assert.equal(validateProductionSmokeRecord({}).valid, false);
});
test('missing export observation prevents acceptance', () => {
  const input = record();
  input.observations.docxExport = false;
  const result = validateProductionSmokeRecord(input);
  assert.equal(result.valid, false);
  assert.equal(result.integrationEvidence.pdfPrintAndDocxExport, false);
});
test('synthetic complete record validates its contract only', () => {
  const result = validateProductionSmokeRecord(record());
  assert.equal(result.valid, true, result.errors.join('; '));
  for (const gate of Object.keys(PRODUCTION_SMOKE_OBSERVATIONS)) assert.equal(result.integrationEvidence[gate], true);
});
