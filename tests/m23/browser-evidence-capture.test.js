import assert from 'node:assert/strict';
import { createBrowserEvidenceCapture, recordBrowserMeasurement, finalizeBrowserEvidence } from '../../src/validation/browser-evidence-capture.js';

const templates=[{id:'old-v1-derived',version:'2.0.0',v1BaselineId:'old-v1-derived'},{id:'future-native-001',version:'3.0.0'}];
const capture=createBrowserEvidenceCapture({templates});
assert.equal(capture.templateCount,2);
assert.equal(capture.results[1].v1BaselineId,null);
recordBrowserMeasurement(capture,'old-v1-derived',{blocks:[{id:'summary',kind:'section-heading',measuredHeight:100}],pagination:{pageCount:1,hasOverflow:false},screenshotArtifact:'artifacts/m23/old-v1-derived.png'});
finalizeBrowserEvidence(capture);
assert.equal(capture.results[0].geometry.status,'collected');
assert.equal(capture.results[0].screenshot.status,'collected');
assert.equal(capture.results[0].comparison.status,'insufficient-evidence');
console.log('M23 browser evidence capture tests passed.');