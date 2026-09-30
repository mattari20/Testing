import test from 'node:test';
import assert from 'node:assert/strict';
import {
  WORD_TEMPLATE_STATUS,
  listWordTemplates,
  getWordTemplate,
  createWordTemplateDownloadRequest,
  validateWordTemplateCatalog
} from '../../src/templates/word-template-catalog.js';

test('word template catalog contains one editable download contract for each V2 template', () => {
  const templates = listWordTemplates();
  assert.equal(templates.length, 7);
  assert.ok(templates.every(template => template.fileName.endsWith('.docx')));
  assert.ok(templates.every(template => template.editable === true));
  assert.ok(templates.every(template => template.requiresLogin === false));
  assert.ok(templates.every(template => template.status === WORD_TEMPLATE_STATUS.PLANNED));
});

test('word template lookup uses the shared V2 template id', () => {
  const template = getWordTemplate('t01-modern-minimalist-cv-design_modern');
  assert.equal(template.fileName, 'T01-Modern-Minimalist-CV-Template.docx');
  assert.equal(template.containsDemoData, true);
});

test('word template download request is deterministic and does not invent a file', () => {
  const request = createWordTemplateDownloadRequest('t07-professional-cv-store-manager-incharge_modern');
  assert.equal(request.fileName, 'T07-Store-Manager-CV-Template.docx');
  assert.equal(request.status, WORD_TEMPLATE_STATUS.PLANNED);
  assert.match(request.path, /word-templates\/T07-Store-Manager-CV-Template\.docx$/);
});

test('word template catalog validates cleanly', () => {
  const result = validateWordTemplateCatalog();
  assert.equal(result.valid, true);
  assert.equal(result.count, 7);
});

test('unknown word template ids are rejected', () => {
  assert.throws(
    () => createWordTemplateDownloadRequest('unknown-template'),
    /Word template not found/
  );
});
