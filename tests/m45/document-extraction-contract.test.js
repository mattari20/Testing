import test from 'node:test';
import assert from 'node:assert/strict';
import { createExtractionAdapter, extractDocument, EXTRACTION_KIND } from '../../src/import/document-extraction-contract.js';
test('creates PDF extraction adapter',()=>{const a=createExtractionAdapter({kind:EXTRACTION_KIND.PDF,extract:async()=>({text:'cv'})});assert.equal(a.kind,'pdf');});
test('extracts through adapter',async()=>{const a=createExtractionAdapter({kind:EXTRACTION_KIND.DOCX,providerId:'x',extract:async s=>({name:s.name})});const r=await extractDocument(a,{name:'file'});assert.equal(r.result.name,'file');});
test('rejects missing extraction function',()=>assert.throws(()=>createExtractionAdapter({kind:EXTRACTION_KIND.PDF}),/Extraction function/));
