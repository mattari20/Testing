import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('preview mounter uses native V2 renderer and replaces its host',async()=>{
  const s=await readFile('src/ui/template-preview-mounter.js','utf8');
  assert.match(s,/renderNativeV2Template/);
  assert.match(s,/replaceChildren/);
});
