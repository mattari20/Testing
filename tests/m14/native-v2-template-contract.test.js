import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const templatePath = new URL('../../src/templates/assets/v2/t01-modern-minimalist-cv-design_modern.html', import.meta.url);
const html = fs.readFileSync(templatePath, 'utf8');

test('native T01 contains no V1 moustache syntax', () => {
  assert.equal(html.includes('{{'), false);
  assert.equal(html.includes('}}'), false);
});

test('native T01 declares V2 template identity', () => {
  assert.match(html, /data-v2-template-id="t01-modern-minimalist-cv-design_modern"/);
  assert.match(html, /data-v2-template-version="2\.0\.0"/);
});

test('native T01 declares semantic sections', () => {
  for (const section of ['photo','skills','languages','summary','experience','education']) {
    assert.match(html, new RegExp('data-v2-section="' + section + '"'));
  }
});

test('native T01 declares repeatable presentation regions', () => {
  for (const source of ['section:experience:entries','section:education:entries','section:skills:values','section:languages:values']) {
    assert.match(html, new RegExp('data-v2-repeat="' + source.replaceAll(':','\\:') + '"'));
  }
});

test('native T01 uses safe declarative bindings', () => {
  assert.match(html, /data-v2-value="identity\.fullName"/);
  assert.match(html, /data-v2-bind-src="asset:profile-photo"/);
  assert.match(html, /data-v2-entry-value="company"/);
  assert.match(html, /data-v2-item-value="value"/);
});
