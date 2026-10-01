import test from 'node:test';import assert from 'node:assert/strict';import {createCVEditorRuntime} from '../../src/application/cv-editor-runtime.js';
test('M1928-M1943 runtime initializes projection and layout',()=>{const r=createCVEditorRuntime({pagination:{pageModel:{width:300,height:800}}});const s=r.refresh();assert.ok(s.projection);assert.ok(s.layout);});
test('M1944-M1959 runtime exposes active document identity',()=>{const r=createCVEditorRuntime();assert.ok(r.getState().activeDocumentId);});
test('M1960-M1975 runtime refresh is deterministic',()=>{const r=createCVEditorRuntime();const a=r.refresh();const b=r.refresh();assert.equal(a.projection.targetedCVId,b.projection.targetedCVId);});
test('M1976-M1991 runtime exposes command history',()=>{const r=createCVEditorRuntime();r.refresh();assert.equal(r.getState().history.canUndo,false);});
test('M1992-M2007 runtime destroy fences refresh',()=>{const r=createCVEditorRuntime();r.destroy();assert.equal(r.refresh(),null);});
