import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('editor page controller composes V2 surface and DOM bindings',async()=>{
  const s=await readFile('src/ui/editor-page-controller.js','utf8');
  assert.match(s,/createEditorSurface/);
  assert.match(s,/bindEditorFields/);
  assert.match(s,/bindEditorActions/);
});
