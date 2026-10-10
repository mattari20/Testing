import assert from 'node:assert/strict';
import fs from 'node:fs';
import { listNativeV2Templates, getNativeV2Template } from '../../src/templates/v2-native-template-catalog.js';

const all = listNativeV2Templates();
assert.equal(all.length, 9);
for (const template of all) {
  assert.ok(['2.0.0','2.1.0','2.2.2'].includes(template.version));
  assert.equal(template.status, 'published');
  assert.equal(template.compatibility, 'v2-compatible');
  assert.ok(template.sourcePath.startsWith('src/templates/assets/v2/'));
}
assert.equal(getNativeV2Template('t02-professional-cv-design_modern').v1BaselineId, 't02-professional-cv-design_modern');
assert.equal(getNativeV2Template('t07-professional-cv-store-manager-incharge_modern').compatibility, 'v2-compatible');

console.log('Native V2 template catalog tests passed.');

assert.equal(getNativeV2Template('t01-modern-minimalist-cv-design_ats').version, '2.2.2');
assert.equal(getNativeV2Template('t01-modern-minimalist-cv-design_simple').version, '2.1.0');
assert.equal(getNativeV2Template('t01-modern-minimalist-cv-design_ats').v1BaselineId, undefined);
assert.equal(getNativeV2Template('t01-modern-minimalist-cv-design_simple').v1BaselineId, undefined);

const atsTemplate = getNativeV2Template('t01-modern-minimalist-cv-design_ats');
assert.ok(atsTemplate.supportedSections.includes('achievements'));
const atsHtml = fs.readFileSync(new URL('../../src/templates/assets/v2/t01-modern-minimalist-cv-design_ats.html', import.meta.url), 'utf8');
assert.match(atsHtml, /data-v2-template-version="2\.2\.2"/);
assert.match(atsHtml, /ats-grid\{display:block\}/);
assert.match(atsHtml, /\.v2-proficiency\{display:none!important\}/);
assert.match(atsHtml, /data-v2-section="achievements"/);
assert.doesNotMatch(atsHtml, /overflow:hidden/);

assert.equal((atsHtml.match(/data-v2-value="identity\.fullName"/g) || []).length, 1);
assert.ok(atsHtml.indexOf('class="ats-header"') < atsHtml.indexOf('data-v2-section="summary"'));
assert.ok(atsHtml.indexOf('data-v2-section="summary"') < atsHtml.indexOf('data-v2-section="experience"'));

assert.match(atsHtml, /identity\.whatsapp/);

const rendererSource = fs.readFileSync(new URL('../../src/render/native-v2-template-renderer.js', import.meta.url), 'utf8');
assert.match(rendererSource, /if\s*\(type\s*===\s*'identity'\)\s*continue/);
assert.match(rendererSource, /if\s*\(isAtsT01\s*&&\s*atsHeader\)\s*\{\s*atsHeader\.insertAdjacentElement\('afterend',\s*wrapper\)/);

assert.match(atsHtml, /ats-personal-section/);
assert.match(atsHtml, /ats-personal-label/);
assert.ok(atsHtml.includes('data-v2-value="identity.cnic"'));
assert.ok(atsHtml.includes('data-v2-value="identity.religion"'));
assert.ok(atsHtml.indexOf('class="ats-header"') < atsHtml.indexOf('ats-personal-section'));
assert.ok(atsHtml.indexOf('class="ats-personal-section"') < atsHtml.indexOf('data-v2-section="summary"'));
