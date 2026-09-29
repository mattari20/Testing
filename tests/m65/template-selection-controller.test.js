import test from 'node:test';
import assert from 'node:assert/strict';
import { createTemplateSelection } from '../../src/templates/template-selection-controller.js';
test('template selection emits a V2 editor command',()=>{const t={id:'future-v2',name:'Future',version:'2.0.0',status:'published',supportedSections:[],capabilities:{nativeContract:true,browserMeasurement:'passed',paginationEvidence:'passed'},compatibility:'v2-compatible',outputs:{}};const s=createTemplateSelection('future-v2',{templates:[t]});if(s.command.type!=='set-template')throw new Error('wrong command');});
