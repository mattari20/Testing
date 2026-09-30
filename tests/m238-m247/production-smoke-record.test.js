import test from 'node:test';
import assert from 'node:assert/strict';
import { validateProductionSmokeRecord } from '../../src/release/production-smoke-record.js';
test('missing live observations fail', () => { assert.equal(validateProductionSmokeRecord({}).valid, false); });
