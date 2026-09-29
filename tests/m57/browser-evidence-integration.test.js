import test from 'node:test';
import assert from 'node:assert/strict';
import { createBrowserEvidenceRecord, validateBrowserEvidenceRecord, aggregateBrowserEvidence } from '../../src/validation/browser-evidence-integration.js';
const good={templateId:'t1',templateVersion:'2.0.0',renderStatus:'passed',geometryStatus:'passed',paginationStatus:'passed',screenshotArtifact:'t1.png'};
test('validates complete browser evidence',()=>{assert.equal(validateBrowserEvidenceRecord(createBrowserEvidenceRecord(good)).valid,true);});
test('requires screenshot and browser stages',()=>{const v=validateBrowserEvidenceRecord(createBrowserEvidenceRecord({templateId:'t1',templateVersion:'2.0.0'}));assert.equal(v.valid,false);});
test('aggregates browser evidence',()=>{const r=aggregateBrowserEvidence([good]);assert.equal(r.status,'complete');});
