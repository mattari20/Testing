import test from 'node:test';
import assert from 'node:assert/strict';
import { PRODUCTION_SMOKE_OBSERVATIONS } from '../../src/release/production-smoke-record.js';
import { evaluateProductionHandoff } from '../../src/release/production-handoff-gate.js';

function completeRecord() {
  return {
    recordVersion: '1.0.0',
    productionUrl: 'https://example.test/cv-builder/',
    deploymentCommitSha: '0123456789abcdef0123456789abcdef01234567',
    environment: 'production',
    observedAt: '2026-09-30T08:00:00+05:00',
    observations: Object.fromEntries(
      Object.values(PRODUCTION_SMOKE_OBSERVATIONS).flat().map(key => [key, true])
    ),
    evidenceReferences: ['observed-evidence'],
    productionSourceBridgeState: 'v2'
  };
}

test('R6 remains open when production evidence is incomplete', () => {
  const result = evaluateProductionHandoff({});
  assert.equal(result.ready, false);
  assert.equal(result.r6, 'OPEN');
  assert.ok(result.reasons.length > 0);
});

test('R6 cannot pass from a complete smoke record while bridge remains V1', () => {
  const record = completeRecord();
  record.productionSourceBridgeState = 'v1';
  const result = evaluateProductionHandoff(record);
  assert.equal(result.ready, false);
  assert.equal(result.r6, 'OPEN');
  assert.match(result.reasons.join('\n'), /productionSourceBridgeState/);
});

test('R6 accepts only a complete observed record with explicit V2 bridge state', () => {
  const result = evaluateProductionHandoff(completeRecord());
  assert.equal(result.ready, true);
  assert.equal(result.r6, 'PASS');
  assert.deepEqual(result.reasons, []);
});
