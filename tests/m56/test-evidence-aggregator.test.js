import test from 'node:test';
import assert from 'node:assert/strict';
import { aggregateTestEvidence, assertTestEvidenceComplete } from '../../src/validation/test-evidence-aggregator.js';
test('aggregates test suites',()=>{const r=aggregateTestEvidence([{suite:'core',status:'passed'},{suite:'export',status:'passed'}]);assert.equal(r.status,'complete');assert.equal(r.passedCount,2);});
test('blocks incomplete evidence',()=>{const r=aggregateTestEvidence([{suite:'core',status:'passed'},{suite:'browser',status:'failed'}]);assert.equal(r.status,'incomplete');assert.throws(()=>assertTestEvidenceComplete(r),/incomplete/);});
