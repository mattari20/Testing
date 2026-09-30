import test from 'node:test';
import assert from 'node:assert/strict';
import { VALIDATION_AREA } from '../../src/validation/system-validation-matrix.js';
import { createFinalAcceptancePackage, assertFinalAcceptanceReady } from '../../src/validation/final-acceptance-package.js';
const releaseGates={implementation:'passed',tests:'passed','golden-baseline':'passed',security:'passed',browser:'passed',export:'passed',import:'passed'};
test('acceptance package blocks incomplete evidence',()=>{const p=createFinalAcceptancePackage({});assert.equal(p.status,'blocked');});
test('acceptance package becomes ready only with all evidence',()=>{const areas=Object.fromEntries(VALIDATION_AREA.map(x=>[x,'passed']));const p=createFinalAcceptancePackage({validation:{areas},release:{gates:releaseGates}});assert.equal(p.status,'ready');assert.equal(assertFinalAcceptanceReady(p),true);});
