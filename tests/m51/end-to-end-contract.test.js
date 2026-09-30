import test from 'node:test';
import assert from 'node:assert/strict';
import { createEndToEndContract, assertEndToEndReady, E2E_STAGES } from '../../src/release/end-to-end-contract.js';
test('end to end contract blocks incomplete system',()=>{const c=createEndToEndContract({});assert.equal(c.status,'blocked');assert.equal(c.stages.length,E2E_STAGES.length);});
test('ready requires all stages and release gates',()=>{const stages=Object.fromEntries(E2E_STAGES.map(x=>[x,'passed']));const release={gates:{implementation:'passed',tests:'passed','golden-baseline':'passed',security:'passed',browser:'passed',export:'passed',import:'passed'}};const c=createEndToEndContract({stages,release});assert.equal(c.status,'ready');assert.equal(c.releaseReadiness.status,'ready');assert.equal(assertEndToEndReady(c),true);});
