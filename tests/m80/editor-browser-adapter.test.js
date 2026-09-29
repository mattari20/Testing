import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('browser adapter requires Playwright-like evaluate boundary',async()=>{
 const s=await readFile('src/ui/editor-browser-adapter.js','utf8');
 assert.match(s,/page\.evaluate/);
 assert.match(s,/data-v2-editor-field/);
});
