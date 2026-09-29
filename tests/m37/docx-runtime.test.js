import test from 'node:test';
import assert from 'node:assert/strict';
import { EXPORT_TYPE } from '../../src/export/export-engine.js';
import { createDocxRuntimeRequest, finalizeDocxRuntimeRequest } from '../../src/export/docx-runtime.js';
const base={outputType:EXPORT_TYPE.DOCX,documentSnapshot:{snapshotType:'targeted-cv',targetedCVId:'cv1'},layoutResult:{pages:[{}]},template:{id:'t1',version:'2.0.0',capabilities:{generatedDocx:true}}};
test('creates editable DOCX runtime request',()=>{const r=createDocxRuntimeRequest(base);assert.equal(r.editable,true);assert.equal(r.status,'provider-required');});
test('finalizes DOCX runtime request',()=>{const r=createDocxRuntimeRequest(base);const x=finalizeDocxRuntimeRequest(r,{artifact:{path:'cv.docx'},provider:'runtime-provider'});assert.equal(x.status,'generated');});
