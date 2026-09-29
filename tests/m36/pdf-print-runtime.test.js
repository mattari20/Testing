import test from 'node:test';
import assert from 'node:assert/strict';
import { EXPORT_TYPE } from '../../src/export/export-engine.js';
import { createPdfPrintRuntimeRequest, finalizePdfPrintRuntimeRequest } from '../../src/export/pdf-print-runtime.js';
const base={outputType:EXPORT_TYPE.PDF,documentSnapshot:{snapshotType:'targeted-cv',targetedCVId:'cv1'},layoutResult:{pages:[{}]},template:{id:'t1',version:'2.0.0',capabilities:{pdf:true,print:true}}};
test('creates provider-neutral PDF runtime request',()=>{const r=createPdfPrintRuntimeRequest(base);assert.equal(r.status,'provider-required');assert.equal(r.pageCount,1);assert.equal(r.providerBoundary.provider,null);});
test('finalizes only with an artifact',()=>{const r=createPdfPrintRuntimeRequest(base);assert.throws(()=>finalizePdfPrintRuntimeRequest(r),/artifact/);const x=finalizePdfPrintRuntimeRequest(r,{artifact:{path:'x.pdf'},provider:'runtime-provider'});assert.equal(x.status,'generated');});
