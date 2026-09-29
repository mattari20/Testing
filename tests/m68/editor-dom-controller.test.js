import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('editor DOM controller exposes field and action binding contracts',async()=>{
  const s=await readFile('src/ui/editor-dom-controller.js','utf8');
  assert.match(s,/data-v2-editor-field/);
  assert.match(s,/data-v2-editor-command/);
  assert.match(s,/surface\.dispatch/);
});
