import assert from 'node:assert/strict';
import { validateNativeTemplateSet } from '../../src/render/native-v2-validation-harness.js';

const templates = [
  { id: 't01', templateVersion: '2.0.0', sourceHtml: '' }
];
const factory = () => ({});
assert.throws(() => validateNativeTemplateSet({ templates, snapshot: {}, documentFactory: factory }), /document/i);

console.log('Native V2 validation harness boundary test passed.');
