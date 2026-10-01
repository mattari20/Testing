import test from 'node:test';import assert from 'node:assert/strict';
import {CV_BUILDER_FINAL_GROUPS} from '../../src/runtime/cv-builder-100-final-groups.js';
import {createCVBuilderLocalStore} from '../../src/runtime/cv-builder-local-store.js';
import {createCVBuilderFeaturePolicy} from '../../src/runtime/cv-builder-feature-policy.js';
test('final group inventory contains 100 groups',()=>assert.equal(CV_BUILDER_FINAL_GROUPS.length,100));
test('local store round-trips state',()=>{const s=createCVBuilderLocalStore();s.write('x',{value:1});assert.deepEqual(s.read('x'),{value:1});s.remove('x');assert.equal(s.read('x'),null);});
test('feature policy preserves safe defaults',()=>{const p=createCVBuilderFeaturePolicy();assert.equal(p.isEnabled('localFirst'),true);assert.equal(p.isEnabled('cloudSave'),false);});
