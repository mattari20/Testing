import test from 'node:test';
import assert from 'node:assert/strict';
import { switchTemplateAndPreview } from '../../src/ui/template-preview-controller.js';
import { createEditorSurface } from '../../src/application/editor-surface.js';

test('template switch routes through editor command',()=>{
  const surface=createEditorSurface({});
  const templates=[{id:'future',name:'Future',version:'2.0.0',status:'published',supportedSections:[],capabilities:{nativeContract:true,browserMeasurement:'passed',paginationEvidence:'passed'},compatibility:'v2-compatible',outputs:{}}];
  assert.throws(()=>switchTemplateAndPreview(surface,'future',{templates}),/layout|compatibility|section|template/i);
});
