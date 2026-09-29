import assert from 'node:assert/strict';
import { createComparisonFixtureSet, validateComparisonFixtureSet } from '../../src/validation/golden-comparison-fixtures.js';
import { listNativeV2Templates } from '../../src/templates/v2-native-template-catalog.js';

const registered=listNativeV2Templates();
const fixtures=createComparisonFixtureSet();
assert.equal(fixtures.length,registered.length);
assert.deepEqual(fixtures.map(x=>x.templateId),registered.map(x=>x.id));
assert.equal(validateComparisonFixtureSet(fixtures).valid,true);

const futureTemplate={id:'future-template-001',v1BaselineId:'future-template-001-v1',sourcePath:'src/templates/assets/v2/future-template-001.html',status:'source-converted'};
const extended=createComparisonFixtureSet({templates:[...registered,futureTemplate]});
assert.equal(extended.length,registered.length+1);
assert.equal(validateComparisonFixtureSet(extended,{templates:[...registered,futureTemplate]}).valid,true);

console.log('M22 dynamic comparison fixture tests passed.');
