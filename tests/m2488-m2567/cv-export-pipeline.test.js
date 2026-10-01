import test from 'node:test';
import assert from 'node:assert/strict';
import { createCVEditorRuntime } from '../../src/application/cv-editor-runtime.js';
import { createCVExportPipeline } from '../../src/application/cv-export-pipeline.js';
test('M2488-M2503 export request is assembled from current runtime',()=>{const r=createCVEditorRuntime();r.refresh();const p=createCVExportPipeline({runtime:r});const q=p.createRequest();assert.equal(q.documentSnapshot.targetedCVId,r.getState().activeDocumentId);assert.ok(q.layout);});
test('M2504-M2519 export request preserves selected format',()=>{const r=createCVEditorRuntime();r.refresh();const p=createCVExportPipeline({runtime:r});assert.equal(p.createRequest('print').format,'print');});
test('M2520-M2535 prepared export reports readiness',()=>{const r=createCVEditorRuntime();r.refresh();const p=createCVExportPipeline({runtime:r});assert.equal(p.prepare().status,'ready');});
test('M2536-M2551 invalid export request is rejected by pipeline validation',()=>{const r=createCVEditorRuntime();const p=createCVExportPipeline({runtime:r});assert.equal(p.validate({version:'bad'}).valid,false);});
test('M2552-M2567 destroyed export pipeline is fenced',()=>{const r=createCVEditorRuntime();const p=createCVExportPipeline({runtime:r});p.destroy();assert.equal(p.createRequest(),null);});