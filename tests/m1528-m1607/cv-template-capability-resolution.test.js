import test from 'node:test';
import assert from 'node:assert/strict';
import { createTemplateRegistry } from '../../src/templates/template-engine.js';
import { createPresentationVariant } from '../../src/templates/presentation-variant-engine.js';
import { resolveTemplateCapabilities, selectResolvedVariant, validateCapabilityResolution } from '../../src/application/cv-template-capability-resolution.js';

const template = createTemplateRegistry([{ id:'classic', name:'Classic', version:'1.0.0', status:'published', capabilities:{ photo:'supported', columns:'supported_with_constraints' } }]).get('classic');
const variants = [
  createPresentationVariant({ id:'photo-inline', level:'field', fieldTypes:['photo'], compatibleTemplates:['classic'] }),
  createPresentationVariant({ id:'two-column', level:'document', compatibleTemplates:['classic'], requirements:{ requiresMeasuredLayout:true } })
];

test('M1528-M1543 resolves template and variant capabilities', () => {
  const result = resolveTemplateCapabilities(template, { photo:true, columns:true }, variants, { measuredLayout:true });
  assert.equal(result.compatible, true);
  assert.equal(result.variants.length, 2);
  assert.equal(validateCapabilityResolution(result).valid, true);
});

test('M1544-M1559 marks constrained content for review', () => {
  const result = resolveTemplateCapabilities(template, { columns:true }, variants, { measuredLayout:false });
  assert.equal(result.compatible, true);
  assert.equal(result.requiresReview, true);
});

test('M1560-M1575 selects preferred compatible variant', () => {
  const result = resolveTemplateCapabilities(template, {}, variants, { measuredLayout:true });
  assert.equal(selectResolvedVariant(result, 'two-column').variantId, 'two-column');
});

test('M1576-M1591 falls back to first compatible variant', () => {
  const result = resolveTemplateCapabilities(template, {}, variants, { measuredLayout:true });
  assert.equal(selectResolvedVariant(result, 'missing').variantId, 'photo-inline');
});

test('M1592-M1607 blocks explicitly incompatible variants', () => {
  const result = resolveTemplateCapabilities(template, {}, [
    createPresentationVariant({ id:'blocked', level:'section', compatibleTemplates:['other'] })
  ], {});
  assert.equal(result.compatible, false);
  assert.equal(result.blockingReasons[0].type, 'variant');
});
