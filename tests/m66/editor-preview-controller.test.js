import test from 'node:test';
import assert from 'node:assert/strict';
import { createEditorSession } from '../../src/application/editor-session.js';
import { createEditorPreview } from '../../src/application/editor-preview-controller.js';
test('editor preview requires a selected template',()=>{const s=createEditorSession({});assert.throws(()=>createEditorPreview(s),/template must be selected/i);});
