import test from 'node:test';
import assert from 'node:assert/strict';
import { EXPORT_TYPE } from '../../src/export/export-engine.js';
import { createProductionExportRequest, createExportArtifactPlan } from '../../src/export/production-export.js';

const snapshot={snapshotType:'targeted-cv',targetedCVId:'cv1',masterProfileId:'p1'};
const layout={version:'1.0.0',pages:[{blocks:[]}]};
const template={id:'t1',version:'2.0.0',outputs:{pdf:true,print:true}};

test('creates a validated PDF production export boundary',()=>{
 const r=createProductionExportRequest({exportType:EXPORT_TYPE.PDF,documentSnapshot:snapshot,layoutResult:layout,template});
 assert.equal(r.status,'ready');
});
test('creates an immutable artifact plan with provenance',()=>{
 const r=createExportArtifactPlan({exportType:EXPORT_TYPE.PDF,documentSnapshot:snapshot,layoutResult:layout,template,provenance:{revision:3}});
 assert.equal(r.artifact.templateId,'t1');
 assert.equal(r.artifact.provenance.revision,3);
});
test('blocks export when required document state is missing',()=>{
 const r=createProductionExportRequest({exportType:EXPORT_TYPE.PDF,template});
 assert.equal(r.status,'blocked');
});
