import assert from 'node:assert/strict';
import { listNativeV2Templates, getNativeV2Template } from '../../src/templates/v2-native-template-catalog.js';

const all = listNativeV2Templates();
assert.equal(all.length, 7);
for (const template of all) {
  assert.equal(template.version, '2.0.0');
  assert.equal(template.status, 'source-converted');
  assert.equal(template.compatibility, 'pending-browser-validation');
  assert.ok(template.sourcePath.startsWith('src/templates/assets/v2/'));
}
assert.equal(getNativeV2Template('t02-professional-cv-design_modern').v1BaselineId, 't02-professional-cv-design_modern');
assert.equal(getNativeV2Template('t07-professional-cv-store-manager-incharge_modern').compatibility, 'pending-browser-validation');

console.log('Native V2 template catalog tests passed.');
