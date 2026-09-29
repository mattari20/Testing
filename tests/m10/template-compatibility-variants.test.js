import assert from 'node:assert/strict';
import {
  createPresentationVariant,
  createVariantRegistry,
  evaluateVariantCompatibility,
  listCompatibleVariants,
  chooseVariantFallback,
  setVariantSelection,
  getVariantSelection,
  validateVariantSelection,
  VARIANT_LEVEL,
  VARIANT_STATE
} from '../../src/templates/presentation-variant-engine.js';
import { buildV1AdapterFromTemplate, evaluateV1AdapterReadiness } from '../../src/templates/template-compatibility-adapter.js';
import { createTemplateDefinition, CAPABILITY } from '../../src/templates/template-engine.js';

const text = createPresentationVariant({
  id: 'languages-text',
  name: 'Languages — Text',
  level: VARIANT_LEVEL.SECTION,
  sections: ['languages'],
  dataTypes: ['object'],
  fieldTypes: ['language'],
  compatibleTemplates: ['modern'],
  semanticType: 'language-proficiency'
});
const bar = createPresentationVariant({
  id: 'languages-bar',
  name: 'Languages — Progress',
  level: VARIANT_LEVEL.SECTION,
  sections: ['languages'],
  dataTypes: ['object'],
  fieldTypes: ['language'],
  compatibleTemplates: ['modern'],
  semanticType: 'language-proficiency',
  requirements: { requiresMeasuredLayout: true }
});
const registry = createVariantRegistry([text, bar]);

let result = evaluateVariantCompatibility(text, {
  templateId: 'modern',
  sectionType: 'languages',
  fieldType: 'language',
  semanticType: 'language-proficiency',
  dataType: 'object'
});
assert.equal(result.state, VARIANT_STATE.SUPPORTED);
assert.equal(result.compatible, true);

result = evaluateVariantCompatibility(text, {
  templateId: 'other',
  sectionType: 'languages',
  fieldType: 'language',
  semanticType: 'language-proficiency',
  dataType: 'object'
});
assert.equal(result.compatible, false);

assert.equal(listCompatibleVariants(registry, {
  templateId: 'modern',
  sectionType: 'languages',
  fieldType: 'language',
  semanticType: 'language-proficiency',
  dataType: 'object'
}).length, 2);

assert.equal(chooseVariantFallback(registry, 'missing', {
  templateId: 'modern',
  sectionType: 'languages',
  fieldType: 'language',
  semanticType: 'language-proficiency',
  dataType: 'object',
  measuredLayout: true
}, ['languages-text']).selectedVariantId, 'languages-text');

let configuration = setVariantSelection({}, 'section', 'languages', 'languages-bar');
assert.equal(getVariantSelection(configuration, 'section', 'languages'), 'languages-bar');
assert.equal(validateVariantSelection(configuration, registry, {
  templateId: 'modern',
  sectionType: 'languages',
  fieldType: 'language',
  semanticType: 'language-proficiency',
  dataType: 'object',
  measuredLayout: true
}).valid, true);

const template = createTemplateDefinition({
  id: 'v1-modern',
  name: 'V1 Modern',
  version: 'v1-baseline',
  capabilities: { summary: CAPABILITY.UNKNOWN },
  compatibility: { sourceState: 'adapter-required' }
});
const adapter = buildV1AdapterFromTemplate(template, {
  bindings: { summary_text: 'summary.text' },
  objectLoops: { experience: 'experience.entries' },
  visibility: { summary: 'summary.visible' },
  theme: { color: 'presentation.theme.color' }
});
assert.equal(adapter.templateId, 'v1-modern');
assert.equal(adapter.bindings.summary_text.target, 'summary.text');
assert.equal(evaluateV1AdapterReadiness(adapter).ready, true);

console.log('M10 template variants and compatibility tests passed.');
