import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
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


const testDir = dirname(fileURLToPath(import.meta.url));
const t04Source = readFileSync(resolve(testDir, '../../src/templates/assets/v2/t04-modern-blue-corporate_modern.html'), 'utf8');
assert.ok(t04Source.includes('T04 Skills base styles intentionally mirror the Language rows.'));
assert.ok(t04Source.includes('.t04-modern-blue-corporate_modern .skill-tag {'));
assert.ok(t04Source.includes('background: transparent !important;'));
assert.ok(t04Source.includes('.skill-tag [data-v2-item-value]'));
assert.ok(t04Source.includes('.t04-modern-blue-corporate_modern .lang-item { margin-bottom: 12px; }'));
assert.ok(t04Source.includes('.t04-modern-blue-corporate_modern .lang-name { font-weight: 700; font-size: 13px; color: #333; }'));
assert.ok(!t04Source.includes('T04 Skills: mirror the clean, readable language-list rhythm.'));

console.log('Native V2 template renderer tests passed.');
