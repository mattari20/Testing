import assert from 'node:assert/strict';
import { createBrowserValidationPlan, runBrowserValidation } from '../../src/render/browser-validation-runner.js';

const templates=[
 {id:'t-old',version:'2.0.0',sourcePath:'old.html',v1BaselineId:'t-old'},
 {id:'t-new',version:'3.0.0',sourcePath:'new.html'}
];
const plan=createBrowserValidationPlan({templates});
assert.equal(plan.templates.length,2);
assert.equal(plan.templates[1].v1BaselineId,null);

const result=await runBrowserValidation({
 templates,
 snapshot:{},
 pageFactory: async () => ({
   renderAndMeasure: async ({template}) => ({
     renderStatus:'ready',
     blocks:[{id:template.id+'-block',kind:'content',measuredHeight:120,measuredWidth:700}],
     screenshotArtifact:'artifact/'+template.id+'.png'
   }),
   close: async () => {}
 })
});
assert.equal(result.templateCount,2);
assert.equal(result.results[0].geometry.status,'collected');
assert.equal(result.results[1].geometry.status,'collected');
assert.equal(result.results[0].comparison.status,'insufficient-evidence');
console.log('M24 browser validation runner tests passed.');