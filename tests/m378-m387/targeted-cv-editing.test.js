import test from 'node:test';
import assert from 'node:assert/strict';
import { createEditorSurface } from '../../src/application/editor-surface.js';
import { createMasterProfile, createTargetedCV, setTargetedSectionVisibility, setTargetedFieldVisibility, setTargetedEntryVisibility } from '../../src/core/career-document-core.js';
import { renderEditorForm } from '../../src/ui/editor-form-renderer.js';

test('targeted visibility does not mutate master profile visibility', () => {
  const surface = createEditorSurface({
    profileData: {
      careerData: {
        sections: [{
          id: 'experience',
          title: 'Experience',
          fields: [{ id: 'role', label: 'Role', value: 'Engineer' }],
          entries: [{ id: 'job1', values: { employer: 'Example' } }],
          repeatable: true
        }]
      }
    }
  });
  surface.dispatch({ type: 'set-visibility', target: { kind: 'section', sectionId: 'experience' }, payload: { visible: false } });
  const state = surface.getState();
  assert.equal(state.session.application.masterProfile.careerData.sections[0].visibility, true);
  assert.deepEqual(state.session.application.targetedCV.configuration.hiddenSections, ['experience']);
});

test('targeted field and entry visibility are stored independently', () => {
  const profile = createMasterProfile({
    id: 'p1',
    careerData: {
      sections: [{
        id: 'experience',
        fields: [{ id: 'role', label: 'Role', value: 'Engineer' }],
        entries: [{ id: 'job1', values: { employer: 'Example' } }],
        repeatable: true
      }]
    }
  });
  const cv = createTargetedCV({ id: 'cv1', masterProfileId: profile.id });
  setTargetedFieldVisibility(cv, 'experience', 'role', false);
  setTargetedEntryVisibility(cv, 'experience', 'job1', false);
  assert.deepEqual(cv.configuration.hiddenFields, ['experience:role']);
  assert.deepEqual(cv.configuration.hiddenEntries, ['experience:job1']);
  assert.equal(profile.careerData.sections[0].fields[0].visibility, true);
  assert.equal(profile.careerData.sections[0].entries[0].visibility, true);
});

test('renderer respects targeted section, field and entry visibility', () => {
  const surface = createEditorSurface({
    profileData: {
      careerData: {
        sections: [{
          id: 'experience',
          title: 'Experience',
          fields: [{ id: 'role', label: 'Role', value: 'Engineer' }, { id: 'company', label: 'Company', value: 'Example' }],
          entries: [{ id: 'job1', values: { employer: 'Example Ltd' } }],
          repeatable: true
        }]
      }
    }
  });
  surface.dispatch({ type: 'set-visibility', target: { kind: 'field', sectionId: 'experience', fieldId: 'company' }, payload: { visible: false } });
  let html = renderEditorForm(surface, surface.getState().session.application.masterProfile).html;
  assert.match(html, /Engineer/);
  assert.doesNotMatch(html, /Example Ltd/);
  surface.dispatch({ type: 'set-visibility', target: { kind: 'entry', sectionId: 'experience', entryId: 'job1' }, payload: { visible: false } });
  html = renderEditorForm(surface, surface.getState().session.application.masterProfile).html;
  assert.doesNotMatch(html, /Example Ltd/);
});

test('structural command notifies subscribers and undo/redo remain available', () => {
  const surface = createEditorSurface({
    profileData: { careerData: { sections: [{ id: 'projects', title: 'Projects', repeatable: true }] } }
  });
  const commands = [];
  const unsubscribe = surface.subscribe((state, command) => commands.push(command.type));
  surface.dispatch({ type: 'add-entry', target: { sectionId: 'projects' }, payload: { values: { name: 'Project' } } });
  assert.deepEqual(commands, ['add-entry']);
  assert.equal(surface.canUndo(), true);
  surface.dispatch({ type: 'undo' });
  assert.equal(surface.canRedo(), true);
  unsubscribe();
});
