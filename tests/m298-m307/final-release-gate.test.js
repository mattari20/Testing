import test from 'node:test';
import assert from 'node:assert/strict';
import {
  FINAL_RELEASE_GATES,
  evaluateFinalReleaseGate,
  assertFinalReleaseReady
} from '../../src/release/final-release-gate.js';

test('final release stays blocked when release gates are unresolved', () => {
  const result = evaluateFinalReleaseGate({
    R1: 'CONDITIONAL',
    R2: 'CONDITIONAL',
    R3: 'CONDITIONAL',
    R4: 'PASS',
    R5: 'PASS',
    R6: 'OPEN',
    R7: 'OPEN',
    R8: 'BLOCKED'
  });

  assert.equal(result.status, 'BLOCKED');
  assert.deepEqual(result.blockers, ['R1', 'R2', 'R3', 'R6', 'R7']);
  assert.equal(result.gates.length, FINAL_RELEASE_GATES.length);
});

test('final release is ready only when R1-R7 are PASS', () => {
  const result = evaluateFinalReleaseGate({
    R1: 'PASS',
    R2: 'PASS',
    R3: 'PASS',
    R4: 'PASS',
    R5: 'PASS',
    R6: 'PASS',
    R7: 'PASS',
    R8: 'PASS'
  });

  assert.equal(result.status, 'READY');
  assert.deepEqual(result.blockers, []);
  assert.equal(assertFinalReleaseReady(result), true);
});

test('R8 cannot self-authorize while an earlier gate is unresolved', () => {
  const result = evaluateFinalReleaseGate({
    R1: 'PASS',
    R2: 'PASS',
    R3: 'PASS',
    R4: 'PASS',
    R5: 'PASS',
    R6: 'OPEN',
    R7: 'OPEN',
    R8: 'PASS'
  });

  assert.equal(result.status, 'BLOCKED');
  assert.deepEqual(result.blockers, ['R6', 'R7']);
  assert.throws(() => assertFinalReleaseReady(result), /Final release is blocked/);
});

test('unknown gate status is rejected', () => {
  const result = evaluateFinalReleaseGate({
    R1: 'DONE'
  });

  assert.equal(result.status, 'BLOCKED');
  assert.ok(result.invalidStatuses.includes('R1'));
  assert.throws(() => assertFinalReleaseReady(result), /Final release is blocked/);
});
