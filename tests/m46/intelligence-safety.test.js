import test from 'node:test';
import assert from 'node:assert/strict';
import { createSafeAISuggestion, validateAISuggestionSafety } from '../../src/intelligence/intelligence-safety.js';
test('accepts safe AI suggestion with review requirement',()=>{const r=createSafeAISuggestion({text:'Consider clarifying the project scope.',category:'summary'});assert.equal(r.safety.safe,true);assert.equal(r.safety.requiresUserReview,true);});
test('blocks fabricated-claim suggestion',()=>assert.equal(validateAISuggestionSafety({text:'Add invented experience'}).safe,false));
