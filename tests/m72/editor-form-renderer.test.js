import test from 'node:test';
import assert from 'node:assert/strict';
import { renderEditorForm } from '../../src/ui/editor-form-renderer.js';
import { createEditorSurface } from '../../src/application/editor-surface.js';

test('form renderer emits V2 field bindings and escapes values',()=>{
  const e=createEditorSurface({profileData:{careerData:{sections:[{id:'s',title:'Contact',fields:[{id:'f',label:'Name',value:'<A>'}]}]}}});
  const r=renderEditorForm(e,e.getState().session.application.masterProfile);
  assert.match(r.html,/data-v2-editor-field="s:f"/);
  assert.match(r.html,/&lt;A&gt;/);
});
