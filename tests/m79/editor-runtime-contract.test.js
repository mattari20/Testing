import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('v2 editor runtime has no dependency on V1 runtime files',async()=>{
 const s=await readFile('src/ui/editor-runtime.js','utf8');
 assert.doesNotMatch(s,/v1-browser|builder\.js|legacy/i);
});

test('v2 editor stack remains framework-neutral',async()=>{
 const paths=['src/ui/editor-runtime.js','src/ui/editor-state-view.js','src/ui/editor-template-controller.js'];
 for(const p of paths){const s=await readFile(p,'utf8');assert.doesNotMatch(s,/react|vue|angular|svelte/i);}
});
