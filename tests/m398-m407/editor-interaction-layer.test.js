import test from 'node:test';
import assert from 'node:assert/strict';
import { createEditorSurface } from '../../src/application/editor-surface.js';
import { createReorderCommand, bindEditorReorder } from '../../src/ui/editor-reorder-controller.js';
import { createPreviewEditCommand } from '../../src/ui/editor-preview-inline-controller.js';
import { renderEditorForm } from '../../src/ui/editor-form-renderer.js';

test('reorder command produces deterministic targeted ordering payloads', () => {
  const section = createReorderCommand('section', null, ['education', 'experience']);
  assert.equal(section.type, 'reorder');
  assert.deepEqual(section.target, { kind: 'section' });
  assert.deepEqual(section.payload.order, ['education', 'experience']);

  const field = createReorderCommand('field', 'experience', ['company', 'role']);
  assert.deepEqual(field.target, { kind: 'field', sectionId: 'experience' });
});

test('drag reorder controller dispatches a reorder command for same-scope drops', () => {
  const calls = [];
  const listeners = new Map();
  const makeElement = id => ({
    dataset: { v2EditorSortable: 'field', v2SectionId: 'experience', v2ItemId: id },
    parentElement: null,
    setAttribute() {},
    addEventListener(name, fn) { listeners.set(id + ':' + name, fn); },
    removeEventListener() {}
  });
  const first = makeElement('role');
  const second = makeElement('company');
  const parent = {
    querySelectorAll() { return [first, second]; }
  };
  first.parentElement = parent; second.parentElement = parent;
  const root = { querySelectorAll() { return [first, second]; } };
  const surface = { dispatch(command) { calls.push(command); } };
  const binding = bindEditorReorder(root, surface);

  const dataTransfer = { setData() {}, effectAllowed: '' };
  listeners.get('role:dragstart')({ dataTransfer });
  listeners.get('company:dragover')({ preventDefault() {} });
  listeners.get('company:drop')({ preventDefault() {} });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].type, 'reorder');
  assert.deepEqual(calls[0].payload.order, ['company', 'role']);
  binding.destroy();
});

test('preview inline commands map identity, field and entry edits to existing editor commands', () => {
  assert.equal(createPreviewEditCommand('identity', { key: 'name' }, 'Ali').type, 'set-identity');
  assert.deepEqual(createPreviewEditCommand('field', { sectionId: 'experience', fieldId: 'role' }, 'Manager').target, { sectionId: 'experience', fieldId: 'role' });
  const entry = createPreviewEditCommand('entry', { sectionId: 'experience', entryId: 'job1', key: 'company' }, 'Example');
  assert.equal(entry.type, 'update-entry');
  assert.deepEqual(entry.payload.values, { company: 'Example' });
});

test('editor form exposes sortable section, field and entry markers', () => {
  const surface = createEditorSurface({
    profileData: {
      careerData: {
        sections: [{
          id: 'experience',
          title: 'Experience',
          fields: [{ id: 'role', label: 'Role', value: 'Engineer' }],
          entries: [{ id: 'job1', values: { company: 'Example' } }],
          repeatable: true
        }]
      }
    }
  });
  const html = renderEditorForm(surface, surface.getState().session.application.masterProfile).html;
  assert.match(html, /data-v2-editor-sortable="section"/);
  assert.match(html, /data-v2-editor-sortable="field"/);
  assert.match(html, /data-v2-editor-sortable="entry"/);
});
