import test from 'node:test';
import assert from 'node:assert/strict';
import { EXPORT_TYPE } from '../../src/export/export-engine.js';
import { createDocxGenerationPlan, createGeneratedDocxArtifactManifest, createBlankDocxArtifactManifest } from '../../src/export/docx-generator.js';

const base={
 outputType:EXPORT_TYPE.DOCX,
 documentSnapshot:{snapshotType:'targeted-cv',targetedCVId:'cv1',masterProfileId:'p1'},
 layoutResult:{pages:[{blocks:[]}]},
 template:{id:'t1',version:'2.0.0',capabilities:{generatedDocx:true,blankDocx:true}}
};

test('creates generated editable DOCX plan',()=>{
 const plan=createDocxGenerationPlan(base);
 assert.equal(plan.mode,EXPORT_TYPE.DOCX);
 assert.equal(plan.generation.editable,true);
 assert.equal(plan.generation.blank,false);
});
test('creates generated DOCX manifest',()=>{
 const m=createGeneratedDocxArtifactManifest(base);
 assert.equal(m.artifactType,EXPORT_TYPE.DOCX);
 assert.equal(m.editable,true);
 assert.equal(m.blank,false);
});
test('creates separate blank DOCX manifest',()=>{
 const m=createBlankDocxArtifactManifest({
  layoutResult:{pages:[]},
  template:base.template
 });
 assert.equal(m.artifactType,EXPORT_TYPE.BLANK_DOCX);
 assert.equal(m.blank,true);
 assert.equal(m.sourceDocumentId,null);
});
test('blank DOCX cannot carry generated snapshot',()=>{
 assert.throws(()=>createDocxGenerationPlan({
  ...base, outputType:EXPORT_TYPE.BLANK_DOCX
 }),/Blank DOCX generation must not receive/);
});
test('generated DOCX requires snapshot',()=>{
 assert.throws(()=>createDocxGenerationPlan({
  ...base, documentSnapshot:undefined
 }),/Generated DOCX requires/);
});
