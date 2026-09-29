import assert from 'node:assert/strict';
import {
  findCanonicalSection,
  isCanonicalSectionVisible,
  getVisibleEntries,
  resolveNativeValue,
  createNativeRenderDefinition
} from '../../src/render/native-v2-template-renderer.js';

const snapshot = {
  careerData: {
    identity: { name: 'Ali', phone: '+92 300 0000000' },
    sections: [
      { id: 'sum1', type: 'summary', visibility: true, fields: [{ id: 'text', metadata: { semanticKey: 'text' }, value: 'Summary text' }], entries: [] },
      { id: 'exp1', type: 'experience', visibility: true, entries: [
        { id: 'e1', visibility: true, values: { company: 'Company A', title: 'Engineer', duration: '2025', desc: 'Built systems' } },
        { id: 'e2', visibility: false, values: { company: 'Hidden Co' } }
      ] }
    ]
  },
  configuration: { hiddenSections: [], hiddenEntries: [] }
};

assert.equal(findCanonicalSection(snapshot, 'experience').id, 'exp1');
assert.equal(isCanonicalSectionVisible(snapshot, findCanonicalSection(snapshot, 'summary')), true);
assert.equal(getVisibleEntries(snapshot, findCanonicalSection(snapshot, 'experience')).length, 1);
assert.equal(resolveNativeValue(snapshot, 'identity.name'), 'Ali');
assert.equal(resolveNativeValue(snapshot, 'section:summary:text'), 'Summary text');
assert.equal(resolveNativeValue({ careerData: { identity: { name: 'Legacy Name' } } }, 'identity.fullName'), 'Legacy Name');
assert.equal(resolveNativeValue(snapshot, 'company', { values: { company: 'Company A' } }), 'Company A');

const definition = createNativeRenderDefinition({ id: 't01-modern-minimalist-cv-design_modern', sourceHtml: '<div data-v2-template-root></div>' });
assert.equal(definition.id, 't01-modern-minimalist-cv-design_modern');

console.log('Native V2 template renderer tests passed.');
