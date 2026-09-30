import test from 'node:test';
import assert from 'node:assert/strict';
import { createEditorSurface } from '../../src/application/editor-surface.js';
import { renderEditorForm } from '../../src/ui/editor-form-renderer.js';

test('builder renders identity and repeatable entries', () => {
  const surface = createEditorSurface({ profileData: { careerData: { identity: { fullName: 'Ali', email: 'ali@example.com' }, sections: [{ id: 'experience', type: 'experience', title: 'Experience', repeatable: true, entries: [{ id: 'job1', values: { employer: 'Example Ltd', role: 'Engineer' } }] }] } } });
  const html = renderEditorForm(surface, surface.getState().session.application.masterProfile).html;
  assert.match(html, /data-v2-editor-identity-field="fullName"/);
  assert.match(html, /data-v2-editor-entry-field/);
  assert.match(html, /Example Ltd/);
  assert.match(html, /data-v2-editor-command="add-entry"/);
  assert.match(html, /data-v2-editor-command="remove-entry"/);
});

test('identity command updates canonical master profile and snapshot', () => {
  const surface = createEditorSurface({ profileData: { careerData: { identity: { fullName: 'Old' } } } });
  surface.dispatch({ type: 'set-identity', target: { key: 'fullName' }, payload: { value: 'New Name' } });
  assert.equal(surface.getState().session.application.masterProfile.careerData.identity.fullName, 'New Name');
  assert.equal(surface.getState().session.snapshot.careerData.identity.fullName, 'New Name');
});

test('undo and redo restore editor state and clear preview', () => {
  const surface = createEditorSurface({ profileData: { careerData: { identity: { fullName: 'Old' } } } });
  surface.dispatch({ type: 'set-identity', target: { key: 'fullName' }, payload: { value: 'New Name' } });
  assert.equal(surface.canUndo(), true);
  surface.dispatch({ type: 'undo' });
  assert.equal(surface.getState().session.application.masterProfile.careerData.identity.fullName, 'Old');
  assert.equal(surface.canRedo(), true);
  assert.equal(surface.getState().preview, null);
  surface.dispatch({ type: 'redo' });
  assert.equal(surface.getState().session.application.masterProfile.careerData.identity.fullName, 'New Name');
});

test('repeatable entry add and update commands remain usable by the builder surface', () => {
  const surface = createEditorSurface({ profileData: { careerData: { sections: [{ id: 'projects', title: 'Projects', repeatable: true }] } } });
  surface.dispatch({ type: 'add-entry', target: { sectionId: 'projects' }, payload: { values: { name: 'CV Builder', description: 'Student tool' } } });
  const entry = surface.getState().session.application.masterProfile.careerData.sections[0].entries[0];
  surface.dispatch({ type: 'update-entry', target: { sectionId: 'projects', entryId: entry.id }, payload: { values: { description: 'CV Builder V2' } } });
  assert.equal(entry.values.description, 'CV Builder V2');
});