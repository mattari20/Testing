import test from 'node:test';import assert from 'node:assert/strict';import {createExportRequest,validateExportRequest,createExportResult} from '../../src/application/cv-export-contract.js';
const snap={targetedCVId:'cv1'};
test('M2008-M2023 creates PDF export request',()=>{const r=createExportRequest({format:'pdf',documentSnapshot:snap});assert.equal(r.format,'pdf');assert.equal(validateExportRequest(r).valid,true);});
test('M2024-M2039 supports declared output formats',()=>{for(const f of ['pdf','docx','print','web'])assert.equal(createExportRequest({format:f,documentSnapshot:snap}).format,f);});
test('M2040-M2055 rejects unsupported format',()=>{assert.throws(()=>createExportRequest({format:'zip',documentSnapshot:snap}));});
test('M2056-M2071 creates stable export result boundary',()=>{const q=createExportRequest({format:'pdf',documentSnapshot:snap});const r=createExportResult(q,{status:'ready'});assert.equal(r.source.targetedCVId,'cv1');});
test('M2072-M2087 export request is isolated',()=>{const q=createExportRequest({format:'pdf',documentSnapshot:snap});q.documentSnapshot.targetedCVId='x';assert.equal(q.documentSnapshot.targetedCVId,'cv1');});
