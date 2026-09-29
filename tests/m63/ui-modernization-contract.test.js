import test from 'node:test';
import assert from 'node:assert/strict';
import { UI_RULE, UI_PHASE, createUIModernizationContract } from '../../src/ui/ui-modernization-contract.js';
test('UI remains frozen by default',()=>{const c=createUIModernizationContract({});assert.equal(c.phase,UI_PHASE.FROZEN);assert.equal(c.status,'blocked');});
test('UI contract requires all protection rules',()=>{const rules=Object.fromEntries(Object.values(UI_RULE).map(x=>[x,'passed']));const c=createUIModernizationContract({phase:UI_PHASE.MODERNIZATION,rules});assert.equal(c.status,'ready');});
