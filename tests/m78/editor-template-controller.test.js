import test from 'node:test';
import assert from 'node:assert/strict';
import { createEditorSurface } from '../../src/application/editor-surface.js';
import { createEditorTemplateController } from '../../src/ui/editor-template-controller.js';
test('template controller is registry-driven',()=>{
 const s=createEditorSurface({});
 const c=createEditorTemplateController(s,{templates:[]});
 assert.deepEqual(c.list(),[]);
});
