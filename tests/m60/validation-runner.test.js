import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('aggregate validation runner contains current M48-M59 suites',async()=>{
  const source=await readFile('scripts/run-v2-validation.mjs','utf8');
  for(const suite of ['test:m48','test:m49','test:m50','test:m51','test:m52','test:m53','test:m54','test:m55','test:m56','test:m57','test:m58','test:m59']){
    assert.match(source,new RegExp(suite.replace(':','\\:')));
  }
});
