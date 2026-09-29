import assert from 'node:assert/strict';
import { listV1TemplateSources, getV1TemplateSource } from '../../src/templates/v1-template-source-registry.js';

const all = listV1TemplateSources();
assert.equal(all.length, 7);
assert.ok(all.every(x => x.source === 'user-uploaded' && x.status === 'source-recovered'));
for (const x of all) assert.ok(getV1TemplateSource(x.id));
console.log('M13 V1 source registry tests passed.');
