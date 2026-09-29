import test from 'node:test';
import assert from 'node:assert/strict';
import { EXPORT_TYPE } from '../../src/export/export-engine.js';
import { createDocxAdapterRequest, attachDocxArtifact } from '../../src/export/docx-adapter.js';
const base={outputType:EXPORT_TYPE.DOCX,documentSnapshot:{snapshotType:'targeted-cv',targetedCVId:'cv1'},layoutResult:{pages:[{}]},template:{id:'t1',version:'2.0.0',capabilities:{generatedDocx:true}}};
test('creates generated DOCX adapter request',()=>{const r=createDocxAdapterRequest(base);assert.equal(r.adapter.kind,'generated-docx');});
test('attaches DOCX artifact',()=>{const r=createDocxAdapterRequest(base);const x=attachDocxArtifact(r,{path:'cv.docx'},'provider');assert.equal(x.status,'generated');});
