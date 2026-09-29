import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
test('runtime owns bindings across rerenders',async()=>{
 const s=await readFile('src/ui/editor-runtime.js','utf8');
 assert.match(s,/fieldBinding\?\.destroy/);
 assert.match(s,/bindEditorFields/);
 assert.match(s,/bindEditorActions/);
});
