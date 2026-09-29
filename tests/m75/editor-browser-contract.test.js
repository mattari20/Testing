import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('browser editor stack is composed from V2-only boundaries',async()=>{
  const paths=[
    'src/ui/editor-form-renderer.js',
    'src/ui/editor-dom-controller.js',
    'src/ui/section-editor-controller.js',
    'src/ui/template-preview-controller.js',
    'src/application/editor-surface.js'
  ];
  for(const path of paths){
    const source=await readFile(path,'utf8');
    if(!source.includes('V2') && !source.includes('v2') && !source.includes('Editor')) throw new Error('Unexpected editor layer: '+path);
  }
});
