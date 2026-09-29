import test from 'node:test';
import assert from 'node:assert/strict';
import { createBuildOnlineRequest, validateBuildOnlineRequest } from '../../src/templates/build-online.js';

const templates=[{id:'t',name:'T',version:'2.0.0',status:'published',supportedSections:[],outputs:{web:true},photo:{},commercial:{access:'free'},capabilities:{nativeContract:true,browserMeasurement:'passed',paginationEvidence:'passed'},sourcePath:'x',v1BaselineId:null}];

test('supports new build flow',()=>{const r=createBuildOnlineRequest('t',{templates,mode:'new'}); assert.equal(r.compatibilityReviewRequired,true); assert.equal(r.canonicalDataMutation,false);});
test('supports Master Profile flow',()=>{const r=createBuildOnlineRequest('t',{templates,mode:'master-profile',masterProfileId:'p1'}); assert.equal(r.masterProfileId,'p1');});
test('supports existing CV flow',()=>{const r=createBuildOnlineRequest('t',{templates,mode:'existing-cv',targetedCVId:'cv1'}); assert.equal(r.targetedCVId,'cv1');});
test('rejects missing required source ids',()=>{assert.throws(()=>createBuildOnlineRequest('t',{templates,mode:'master-profile'}));});
test('validation blocks canonical mutation',()=>{const r={templateId:'t',mode:'new',canonicalDataMutation:true}; assert.equal(validateBuildOnlineRequest(r).valid,false);});
