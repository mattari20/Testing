import assert from 'node:assert/strict';
import { createComparisonFixtureSet, validateComparisonFixtureSet, M22_TEMPLATE_IDS } from '../../src/validation/golden-comparison-fixtures.js';

const fixtures=createComparisonFixtureSet();
assert.equal(fixtures.length,7);
assert.deepEqual(fixtures.map(x=>x.templateId),M22_TEMPLATE_IDS);
assert.equal(validateComparisonFixtureSet(fixtures).valid,true);

const broken=fixtures.slice(0,6);
assert.equal(validateComparisonFixtureSet(broken).valid,false);
console.log('M22 comparison fixture tests passed.');
