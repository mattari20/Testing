import test from 'node:test';
import assert from 'node:assert/strict';
import { PREVIEW_MODE, createDemoProfile, createTemplatePreviewRequest, validateTemplatePreviewRequest } from '../../src/templates/template-preview.js';

const templates = [{id:'demo-template',name:'Demo',version:'2.0.0',status:'published',supportedSections:['summary'],outputs:{web:true},photo:{supported:false},commercial:{access:'free'},capabilities:{nativeContract:true,browserMeasurement:'passed',paginationEvidence:'passed'},sourcePath:'x',v1BaselineId:null}];

test('creates controlled demo profile without private data',()=>{const p=createDemoProfile(); assert.equal(p.kind,'demo'); assert.equal(p.privateData,false);});
test('creates demo preview request',()=>{const r=createTemplatePreviewRequest('demo-template',{templates}); assert.equal(r.mode,PREVIEW_MODE.DEMO); assert.equal(r.provenance.source,'controlled-demo-profile'); assert.equal(r.privateDataAuthorized,false);});
test('My Data preview requires explicit authorization',()=>{const r=createTemplatePreviewRequest('demo-template',{templates,mode:PREVIEW_MODE.MY_DATA,masterProfileId:'p1'}); assert.equal(validateTemplatePreviewRequest(r).valid,false);});
test('authorized My Data preview is valid',()=>{const r=createTemplatePreviewRequest('demo-template',{templates,mode:PREVIEW_MODE.MY_DATA,masterProfileId:'p1',privateDataAuthorized:true}); assert.equal(validateTemplatePreviewRequest(r).valid,true);});
