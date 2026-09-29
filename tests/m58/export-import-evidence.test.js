import test from 'node:test';
import assert from 'node:assert/strict';
import { createExportEvidence, createImportEvidence, validateExportEvidence, validateImportEvidence } from '../../src/validation/export-import-evidence.js';
test('validates complete export evidence',()=>{const e=createExportEvidence({outputType:'pdf',generationStatus:'passed',validationStatus:'passed',provenanceStatus:'passed',artifact:{id:'a'}});assert.equal(validateExportEvidence(e).valid,true);});
test('validates complete import evidence',()=>{const e=createImportEvidence({sourceType:'docx',extractionStatus:'passed',reviewStatus:'passed',acceptanceStatus:'passed',provenanceStatus:'passed'});assert.equal(validateImportEvidence(e).valid,true);});
test('blocks incomplete export evidence',()=>assert.equal(validateExportEvidence(createExportEvidence({outputType:'pdf'})).valid,false));
