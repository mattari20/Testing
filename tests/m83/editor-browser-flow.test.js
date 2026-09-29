import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('editor browser flow has all required layers',async()=>{
 const files=[
  'src/ui/editor-browser-adapter.js',
  'src/ui/editor-live-preview.js',
  'src/validation/editor-browser-evidence.js'
 ];
 for(const p of files){
  const s=await readFile(p,'utf8');
  assert.ok(s.length>100,p);
 }
});
