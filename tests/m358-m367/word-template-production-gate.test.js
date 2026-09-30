import test from 'node:test';
import assert from 'node:assert/strict';
import manifest from '../../docs/03-implementation/FINAL_WORD_TEMPLATE_ASSET_MANIFEST.json' with { type: 'json' };
import { evaluateWordTemplateProductionGate, assertWordTemplateProductionReady } from '../../src/release/word-template-production-gate.js';

function validObservations() {
  return manifest.assets.map(asset => ({
    templateId: asset.templateId,
    fileName: asset.fileName,
    url: manifest.productionBasePath + asset.fileName,
    httpStatus: 200,
    sha256: asset.sha256,
    sizeBytes: asset.sizeBytes,
    observedAt: '2026-09-30T12:00:00+05:00'
  }));
}

test('blocks until all seven live observations exist and match the manifest', () => {
  const result = evaluateWordTemplateProductionGate([]);
  assert.equal(result.status, 'BLOCKED');
  assert.equal(result.requiredCount, 7);
  assert.equal(result.observedCount, 0);
  assert.ok(result.failures.some(item => item.reason === 'missing-observation'));
});

test('passes only when every live observation matches the final manifest', () => {
  const result = evaluateWordTemplateProductionGate(validObservations());
  assert.equal(result.status, 'PASS');
  assert.equal(result.failures.length, 0);
  assert.doesNotThrow(() => assertWordTemplateProductionReady(result));
});

test('blocks a single hash mismatch', () => {
  const observations = validObservations();
  observations[2] = { ...observations[2], sha256: '0'.repeat(64) };
  const result = evaluateWordTemplateProductionGate(observations);
  assert.equal(result.status, 'BLOCKED');
  assert.ok(result.failures.some(item => item.templateId === manifest.assets[2].templateId && item.reason === 'sha256-mismatch'));
});

test('blocks duplicate or missing observations', () => {
  const observations = validObservations();
  observations.pop();
  observations.push({ ...observations[0] });
  const result = evaluateWordTemplateProductionGate(observations);
  assert.equal(result.status, 'BLOCKED');
  assert.ok(result.failures.some(item => item.reason === 'missing-observation'));
  assert.ok(result.failures.some(item => item.reason === 'duplicate-observation'));
});

test('blocks a non-200 response even when the local hash is correct', () => {
  const observations = validObservations();
  observations[0] = { ...observations[0], httpStatus: 404 };
  const result = evaluateWordTemplateProductionGate(observations);
  assert.equal(result.status, 'BLOCKED');
  assert.ok(result.failures.some(item => item.templateId === manifest.assets[0].templateId && item.reason === 'http-status-not-200'));
});
