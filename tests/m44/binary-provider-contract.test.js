import test from 'node:test';
import assert from 'node:assert/strict';
import { createBinaryProviderContract, generateWithBinaryProvider, PROVIDER_KIND } from '../../src/export/binary-provider-contract.js';
test('creates a PDF provider contract',()=>{const c=createBinaryProviderContract({kind:PROVIDER_KIND.PDF,providerId:'test',generate:async()=>({bytes:'x'})});assert.equal(c.kind,'pdf');});
test('generates through provider boundary',async()=>{const c=createBinaryProviderContract({kind:PROVIDER_KIND.DOCX,generate:async req=>({requestId:req.id})});const r=await generateWithBinaryProvider(c,{id:'x'});assert.equal(r.artifact.requestId,'x');});
test('rejects missing provider function',()=>assert.throws(()=>createBinaryProviderContract({kind:PROVIDER_KIND.PDF}),/generate function/));
