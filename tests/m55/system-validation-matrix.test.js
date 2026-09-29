import test from 'node:test';
import assert from 'node:assert/strict';
import { VALIDATION_AREA, createSystemValidationMatrix, assertSystemValidationComplete } from '../../src/validation/system-validation-matrix.js';
test('matrix reports incomplete areas',()=>{const m=createSystemValidationMatrix({});assert.equal(m.status,'incomplete');assert.equal(m.incompleteAreas.length,VALIDATION_AREA.length);});
test('matrix completes only when every area passes',()=>{const areas=Object.fromEntries(VALIDATION_AREA.map(x=>[x,'passed']));const m=createSystemValidationMatrix({areas});assert.equal(m.status,'complete');assert.equal(assertSystemValidationComplete(m),true);});
