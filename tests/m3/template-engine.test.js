import assert from 'node:assert/strict';
import {
  CAPABILITY,
  TEMPLATE_STATUS,
  createTemplateDefinition,
  createTemplateRegistry,
  evaluateTemplateCompatibility,
  switchTemplateConfiguration
} from '../../src/templates/template-engine.js';
import { createV1TemplateCatalog, V1_TEMPLATE_IDS, V1_TEMPLATE_COMPATIBILITY_STATE } from '../../src/templates/v1-template-catalog.js';

const template = createTemplateDefinition({
  id: 'test-template',
  name: 'Test Template',
  version: '1.0.0',
  status: TEMPLATE_STATUS.PUBLISHED,
  supportedSections: ['summary', 'experience'],
  capabilities: {
    summary: CAPABILITY.SUPPORTED,
    experience: CAPABILITY.CONSTRAINED,
    publications: CAPABILITY.PRESERVED
  },
  outputs: { web: true, pdf: true, print: true }
});

const registry = createTemplateRegistry([template]);
assert.equal(registry.size(), 1);
assert.equal(registry.get('test-template').name, 'Test Template');
assert.throws(() => registry.register(template), /already registered/);

const evaluation = evaluateTemplateCompatibility(template, {
  summary: true,
  experience: true,
  publications: true
});
assert.equal(evaluation.results.summary, CAPABILITY.SUPPORTED);
assert.equal(evaluation.results.experience, CAPABILITY.CONSTRAINED);
assert.equal(evaluation.results.publications, CAPABILITY.PRESERVED);
assert.equal(evaluation.compatible, false);
assert.equal(evaluation.requiresReview, true);

const switched = switchTemplateConfiguration(
  { presentation: { theme: 'blue' }, template: { id: 'old' } },
  'test-template',
  { version: '1.0.0', preservedContent: ['publications'] }
);
assert.equal(switched.template.id, 'test-template');
assert.equal(switched.template.version, '1.0.0');
assert.deepEqual(switched.presentation, { theme: 'blue' });

const catalog = createV1TemplateCatalog();
assert.equal(catalog.length, 9);
assert.deepEqual(catalog.map(item => item.id), V1_TEMPLATE_IDS);
assert.ok(catalog.every(item => item.compatibility.sourceState === V1_TEMPLATE_COMPATIBILITY_STATE.ASSET_RECONCILIATION));
assert.ok(catalog.every(item => item.capabilities['summary'] === CAPABILITY.UNKNOWN));

console.log('M3 template engine tests passed.');
