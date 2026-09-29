import test from 'node:test';
import assert from 'node:assert/strict';
import { createEditorSurface } from '../../src/application/editor-surface.js';

test('editor surface owns session state and dispatches commands',()=>{
  const e=createEditorSurface({});
  const before=e.getState();
  assert.ok(before.session);
  assert.throws(()=>e.dispatch({
    type:'set-field',
    target:{sectionId:'missing',fieldId:'x'},
    payload:{value:'x'}
  }),/Section not found/i);
  assert.equal(e.getState().session, before.session);
});
