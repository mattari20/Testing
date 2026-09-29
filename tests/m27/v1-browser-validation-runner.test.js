import assert from 'node:assert/strict';
import { createV1BrowserValidationPlan } from '../../src/render/v1-browser-validation-runner.js';
const plan=createV1BrowserValidationPlan({templates:[{id:'t01',sourcePath:'x.html',v1BaselineId:'t01'}]});
assert.equal(plan.templateCount,undefined);
assert.equal(plan.templates[0].v1BaselineId,'t01');
console.log('M27 V1 browser validation runner tests passed.');