import test from 'node:test';
import assert from 'node:assert/strict';
import { createEditorSurface } from '../../src/application/editor-surface.js';
import { createEditorStateView } from '../../src/ui/editor-state-view.js';
test('state view exposes non-sensitive editor state',()=>{
 const v=createEditorStateView(createEditorSurface({})).read();
 assert.equal(v.dirty,false); assert.ok(v.masterProfileId); assert.ok(v.targetedCVId);
});
