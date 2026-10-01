import assert from 'node:assert/strict';
import { listNativeV2Templates, getNativeV2Template } from '../../src/templates/v2-native-template-catalog.js';

const all = listNativeV2Templates();
assert.equal(all.length, 9);
for (const template of all) {
  assert.ok(['2.0.0','2.1.0'].includes(template.version));
  assert.equal(template.status, 'published');
  assert.equal(template.compatibility, 'v2-compatible');
  assert.ok(template.sourcePath.startsWith('src/templates/assets/v2/'));
}
assert.equal(getNativeV2Template('t02-professional-cv-design_modern').v1BaselineId, 't02-professional-cv-design_modern');
assert.equal(getNativeV2Template('t07-professional-cv-store-manager-incharge_modern').compatibility, 'v2-compatible');

console.log('Native V2 template catalog tests passed.');

assert.equal(getNativeV2Template('t01-modern-minimalist-cv-design_ats').version, '2.1.0');
assert.equal(getNativeV2Template('t01-modern-minimalist-cv-design_simple').version, '2.1.0');
assert.equal(getNativeV2Template('t01-modern-minimalist-cv-design_ats').v1BaselineId, undefined);
assert.equal(getNativeV2Template('t01-modern-minimalist-cv-design_simple').v1BaselineId, undefined);
