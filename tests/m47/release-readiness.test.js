import test from 'node:test';
import assert from 'node:assert/strict';
import { createReleaseReadiness, assertReleaseReady } from '../../src/release/release-readiness.js';
test('release is blocked when gates are pending',()=>{const r=createReleaseReadiness({});assert.equal(r.status,'blocked');assert.ok(r.blockers.length>0);});
test('release becomes ready only when all gates pass',()=>{const gates={implementation:'passed',tests:'passed','golden-baseline':'passed',security:'passed',browser:'passed',export:'passed',import:'passed'};const r=createReleaseReadiness({gates});assert.equal(r.status,'ready');assert.equal(assertReleaseReady(r),true);});
