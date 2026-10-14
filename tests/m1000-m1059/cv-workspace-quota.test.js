import test from 'node:test';
import assert from 'node:assert/strict';
import { createCVWorkspaceController } from '../../src/ui/cv-workspace-controller.js';
import { createEditorSurface } from '../../src/application/editor-surface.js';

function makeSurface() {
  return createEditorSurface({
    profileData:{careerData:{identity:{fullName:'Test User'},sections:[]}},
    cvData:{title:'Test CV'}
  });
}

test('workspace quota recovery trims older history and keeps newest snapshot', () => {
  const map = new Map();
  let failNextWrite = false;
  const store = {
    getItem:key => map.has(key) ? map.get(key) : null,
    setItem(key, value) {
      if (failNextWrite) {
        failNextWrite = false;
        const error = new Error('quota exceeded');
        error.name = 'QuotaExceededError';
        throw error;
      }
      map.set(key, String(value));
    },
    removeItem:key => map.delete(key)
  };
  const surface = makeSurface();
  const workspace = createCVWorkspaceController({surface, storage:store});
  workspace.save();
  const id = workspace.getActiveDocument().id;
  surface.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Updated User'}});
  failNextWrite = true;
  assert.doesNotThrow(() => workspace.save());
  assert.equal(workspace.getVersions(id).length, 1);
  assert.equal(workspace.getVersions(id)[0].masterProfile.careerData.identity.fullName, 'Updated User');
  const saved = JSON.parse(map.get('estudent_cv_workspace_v2_2027'));
  assert.equal(saved.workspace.activeDocumentId, id);
  assert.equal(saved.versions[id].length, 1);
});

test('unreadable workspace storage is preserved instead of deleted', () => {
  let removed = false;
  const store = {
    getItem:() => '{invalid json',
    setItem:() => {},
    removeItem:() => { removed = true; }
  };
  const workspace = createCVWorkspaceController({surface:makeSurface(), storage:store});
  assert.equal(workspace.getState().documents.length, 1);
  assert.equal(removed, false);
});
