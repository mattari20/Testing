import assert from 'node:assert/strict';
import { createGenericV1TemplateAdapter, getV1Visibility } from '../../src/templates/v1-browser-template-adapter.js';

const source='<div>{{#toggle_exp_visible}}{{EXPERIENCE_LIST}}<span>{{company}} {{duration}} {{title}} {{desc}}</span>{{/EXPERIENCE_LIST}}{{/toggle_exp_visible}}{{NAME}}{{PHOTO}}</div>';
const adapter=createGenericV1TemplateAdapter({id:'test-v1',version:'v1'},source);
assert.equal(adapter.bindings.NAME.target,'identity.fullName');
assert.equal(adapter.loops.object.EXPERIENCE_LIST.sectionType,'experience');
assert.equal(adapter.loops.object.EXPERIENCE_LIST.fields.desc,'description');
assert.equal(adapter.visibility.toggle_exp_visible,'experience');
assert.equal(getV1Visibility(adapter,{configuration:{hiddenSections:['experience']}}).toggle_exp_visible,false);
console.log('M27 V1 generic adapter tests passed.');