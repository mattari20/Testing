import assert from 'node:assert/strict';
import { createGoldenBaselineFixture, compareGoldenEvidence, COMPARISON_STATUS } from '../../src/validation/golden-baseline-comparison.js';

const fixture = createGoldenBaselineFixture({
  templateId:'t01-modern-minimalist-cv-design_modern',
  baselineId:'v1-golden-t01-modern',
  expected:{pageCount:1}
});
assert.equal(fixture.viewport.width,794);
const result=compareGoldenEvidence({
  templateId:fixture.templateId,
  baselineId:fixture.baselineId,
  dimensions:[
    {dimension:'typography',status:COMPARISON_STATUS.IDENTICAL_WITHIN_TOLERANCE},
    {dimension:'pagination',status:COMPARISON_STATUS.INSUFFICIENT_EVIDENCE}
  ]
});
assert.equal(result.blockingRegression,false);
assert.equal(result.evidenceComplete,false);
console.log('M21 Golden Baseline comparison tests passed.');
