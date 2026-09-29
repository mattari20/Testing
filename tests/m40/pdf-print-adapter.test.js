import test from 'node:test';
import assert from 'node:assert/strict';
import { EXPORT_TYPE } from '../../src/export/export-engine.js';
import { createPdfPrintAdapterRequest, attachPdfPrintArtifact } from '../../src/export/pdf-print-adapter.js';
const base={outputType:EXPORT_TYPE.PDF,documentSnapshot:{snapshotType:'targeted-cv',targetedCVId:'cv1'},layoutResult:{pages:[{}]},template:{id:'t1',version:'2.0.0',capabilities:{pdf:true}}};
test('creates PDF adapter request',()=>{const r=createPdfPrintAdapterRequest(base);assert.equal(r.adapter.kind,'pdf-binary');assert.equal(r.adapter.provider,null);});
test('attaches generated artifact',()=>{const r=createPdfPrintAdapterRequest(base);const x=attachPdfPrintArtifact(r,{path:'cv.pdf'},'provider');assert.equal(x.status,'generated');});
