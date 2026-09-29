import assert from 'node:assert/strict';
import { createEvidenceRecord, validateEvidenceRecord } from '../../src/validation/golden-evidence.js';
import { COMPARISON_DIMENSION, COMPARISON_STATUS } from '../../src/validation/golden-baseline-comparison.js';

const r=createEvidenceRecord({
 templateId:'t01-modern-minimalist-cv-design_modern',
 baselineId:'v1-golden:t01',
 dimension:COMPARISON_DIMENSION.SPACING
});
assert.equal(r.status,COMPARISON_STATUS.INSUFFICIENT_EVIDENCE);
assert.equal(validateEvidenceRecord(r).valid,true);

const certified=createEvidenceRecord({
 templateId:'t01-modern-minimalist-cv-design_modern',
 baselineId:'v1-golden:t01',
 dimension:COMPARISON_DIMENSION.SPACING,
 status:COMPARISON_STATUS.IDENTICAL_WITHIN_TOLERANCE,
 referenceArtifact:'artifact://v1-v2-spacing'
});
assert.equal(validateEvidenceRecord(certified).valid,true);

console.log('M22 evidence record tests passed.');
