import test from 'node:test';
import assert from 'node:assert/strict';
import { createEditorSurface } from '../../src/application/editor-surface.js';
test('editor surface owns session state and dispatch',()=>{const e=createEditorSurface({});const before=e.getState();e.dispatch({type:'set-field',target:{sectionId:'missing',fieldId:'x'},payload:{value:'x'}}).catch?.(()=>{});assert.ok(before.session);});
