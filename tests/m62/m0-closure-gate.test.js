import test from 'node:test';
import assert from 'node:assert/strict';
import { M0_GATE, createM0ClosureGate, assertM0Closed } from '../../src/release/m0-closure-gate.js';
test('M0 remains blocked without evidence',()=>{const g=createM0ClosureGate({});assert.equal(g.status,'blocked');assert.equal(g.blockers.length,Object.keys(M0_GATE).length);});
test('M0 closes only when every gate passes',()=>{const gates=Object.fromEntries(Object.values(M0_GATE).map(x=>[x,'passed']));const g=createM0ClosureGate({gates});assert.equal(g.status,'closed');assert.equal(assertM0Closed(g),true);});
