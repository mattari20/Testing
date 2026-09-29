import assert from 'node:assert/strict';
import { createPairedComparisonPlan } from '../../src/validation/paired-browser-comparison.js';
const plan=createPairedComparisonPlan({templates:[{id:'t01',v1BaselineId:'t01',sourcePath:'v2.html'}],viewport:{width:794,height:1123,deviceScaleFactor:1}});
assert.equal(plan.templates.length,1);
assert.equal(plan.templates[0].baselineId,'t01');
assert.equal(plan.viewport.width,794);
console.log('M28 paired comparison plan tests passed.');