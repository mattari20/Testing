import test from 'node:test';
import assert from 'node:assert/strict';
import { EXPORT_TYPE } from '../../src/export/export-engine.js';
import { createPdfArtifactManifest, createPrintArtifactManifest, createPdfPrintGenerationPlan } from '../../src/export/pdf-print-generator.js';

const base={
 outputType:EXPORT_TYPE.PDF,
 documentSnapshot:{snapshotType:'targeted-cv',targetedCVId:'cv1',masterProfileId:'p1'},
 layoutResult:{pages:[{blocks:[]},{blocks:[]}]},
 template:{id:'t1',version:'2.0.0',capabilities:{pdf:true,print:true}}
};

test('creates a semantic PDF generation plan',()=>{
 const plan=createPdfPrintGenerationPlan(base);
 assert.equal(plan.status,'ready');
 assert.equal(plan.generation.pageCount,2);
 assert.equal(plan.generation.semanticPaginationRequired,true);
});
test('creates PDF artifact manifest',()=>{
 const m=createPdfArtifactManifest(base);
 assert.equal(m.artifactType,EXPORT_TYPE.PDF);
 assert.equal(m.pageCount,2);
 assert.equal(m.status,'planned');
});
test('creates print artifact manifest',()=>{
 const m=createPrintArtifactManifest({...base,outputType:EXPORT_TYPE.PRINT});
 assert.equal(m.artifactType,EXPORT_TYPE.PRINT);
 assert.equal(m.binaryGeneration,'browser-print-boundary');
});
test('blocks generation when layout is missing',()=>{
 assert.throws(()=>createPdfPrintGenerationPlan({...base,layoutResult:null}),/Export is blocked|layout/i);
});
