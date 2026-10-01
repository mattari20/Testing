import test from 'node:test';
import assert from 'node:assert/strict';
import {CV_EDITOR_PRODUCTION_GROUPS} from '../../src/application/cv-editor-production-group-registry.js';
import {evaluateProductionContract} from '../../src/application/cv-editor-production-contract.js';
import {createCVEditorProductionGate} from '../../src/application/cv-editor-production-gate.js';
import {createCVEditorFeaturePolicy} from '../../src/application/cv-editor-feature-policy.js';
import {createDataSafetyReport} from '../../src/application/cv-editor-data-safety.js';

test('production registry contains exactly 100 groups',()=>{assert.equal(CV_EDITOR_PRODUCTION_GROUPS.length,100);assert.equal(new Set(CV_EDITOR_PRODUCTION_GROUPS.map(g=>g.group)).size,100);});
test('production contract validates present and callable targets',()=>{const root={adapter:{getState(){},refresh(){},edit(){},undo(){},redo(){},destroy(){}},application:{}};const groups=[{group:1,domain:'t',name:'f',target:'adapter.getState',expectation:'callable'}];assert.equal(evaluateProductionContract(root,groups).valid,true);});
test('production gate reports missing contracts without throwing',()=>{const gate=createCVEditorProductionGate({application:{},adapter:{}});assert.equal(gate.inspect().ready,false);});
test('feature policy is local-first by default',()=>{const policy=createCVEditorFeaturePolicy();assert.equal(policy.enabled('editor'),true);assert.equal(policy.enabled('accounts'),false);});
test('data safety removes credential-like fields',()=>{const report=createDataSafetyReport({name:'A',password:'x',accessToken:'y'});assert.equal(report.sanitized.password,undefined);assert.equal(report.sanitized.accessToken,undefined);assert.equal(report.removedSecrets,true);});
