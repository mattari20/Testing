import test from 'node:test';
import assert from 'node:assert/strict';
import { listNativeV2Templates } from '../../src/templates/v2-native-template-catalog.js';
import { createTemplateLibraryPlan, listTemplateLibraryEntries } from '../../src/templates/template-library.js';
import { createTemplatePreviewRequest, validateTemplatePreviewRequest } from '../../src/templates/template-preview.js';
import { createBuildOnlineRequest, validateBuildOnlineRequest } from '../../src/templates/build-online.js';

test('native catalog exposes complete gallery metadata for every published template', () => {
  const templates = listNativeV2Templates();
  assert.equal(templates.length, 9);
  for (const template of templates) {
    assert.equal(template.status, 'published');
    assert.ok(template.careerLevel.length);
    assert.ok(template.industry.length);
    assert.ok(template.style.length);
    assert.ok(template.supportedSections.length);
    assert.equal(template.discovery.searchable, true);
    assert.equal(template.demo.available, true);
    assert.equal(template.outputs.web, true);
    assert.equal(template.outputs.pdf, true);
    assert.equal(template.outputs.print, true);
    assert.equal(template.outputs.onlineCV, true);
  }
});

test('gallery filters are driven by native catalog metadata', () => {
  const templates = listNativeV2Templates();
  assert.ok(listTemplateLibraryEntries(templates, { careerLevel: ['Student'] }).length >= 1);
  assert.ok(listTemplateLibraryEntries(templates, { industry: ['Design'] }).length >= 1);
  assert.ok(listTemplateLibraryEntries(templates, { style: ['Corporate'] }).length >= 1);
});

test('template preview remains demo-only and private-data safe', () => {
  const templates = listNativeV2Templates();
  const request = createTemplatePreviewRequest(templates[0].id, { templates });
  assert.equal(request.mode, 'demo');
  assert.equal(request.privateDataAuthorized, false);
  assert.equal(validateTemplatePreviewRequest(request).valid, true);
});

test('Build Online keeps template selection explicit and does not mutate canonical data', () => {
  const templates = listNativeV2Templates();
  const request = createBuildOnlineRequest(templates[0].id, { templates, mode: 'new' });
  assert.equal(request.templateId, templates[0].id);
  assert.equal(request.canonicalDataMutation, false);
  assert.equal(validateBuildOnlineRequest(request).valid, true);
});

test('gallery library plan remains registry driven', () => {
  const plan = createTemplateLibraryPlan(listNativeV2Templates());
  assert.equal(plan.templateCount, 9);
  assert.equal(plan.publishedCount, 9);
  assert.equal(plan.freeCount, 9);
});
