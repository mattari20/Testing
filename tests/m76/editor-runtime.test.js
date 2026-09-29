import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
test('editor runtime composes page mount and form renderer',async()=>{
 const s=await readFile('src/ui/editor-runtime.js','utf8');
 assert.match(s,/mountEditorPage/); assert.match(s,/renderEditorForm/);
});
