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


test('persistent quota failures report a recoverable error and roll back history', () => {
  const map = new Map();
  let rejectWrites = false;
  const store = {
    getItem: key => map.has(key) ? map.get(key) : null,
    setItem(key, value) {
      if (rejectWrites) {
        const error = new Error('quota exceeded');
        error.name = 'QuotaExceededError';
        throw error;
      }
      map.set(key, String(value));
    },
    removeItem: key => map.delete(key)
  };
  const surface = makeSurface();
  const workspace = createCVWorkspaceController({surface,storage:store});
  workspace.save();
  const id = workspace.getActiveDocument().id;
  const versionsBefore = workspace.getVersions(id);
  const savedBefore = map.get('estudent_cv_workspace_v2_2027');
  surface.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'In-session edit'}});
  rejectWrites = true;
  assert.throws(() => workspace.save(), /Browser storage is full/);
  assert.deepEqual(workspace.getVersions(id), versionsBefore);
  assert.equal(map.get('estudent_cv_workspace_v2_2027'), savedBefore);
  assert.equal(surface.getState().session.application.masterProfile.careerData.identity.fullName, 'In-session edit');
});

test('non-quota storage errors are propagated and do not mutate history', () => {
  const map = new Map();
  let failure = null;
  const store = {
    getItem: key => map.has(key) ? map.get(key) : null,
    setItem(key, value) {
      if (failure) throw failure;
      map.set(key,String(value));
    },
    removeItem: key => map.delete(key)
  };
  const workspace = createCVWorkspaceController({surface:makeSurface(),storage:store});
  workspace.save();
  const id = workspace.getActiveDocument().id;
  const versionsBefore = workspace.getVersions(id);
  failure = new Error('storage denied');
  assert.throws(() => workspace.save(), /storage denied/);
  assert.deepEqual(workspace.getVersions(id), versionsBefore);
});

test('storage read exceptions are handled without deleting the workspace key', () => {
  let removed = false;
  const store = {
    getItem() { throw new Error('storage read denied'); },
    setItem() { throw new Error('unexpected write during startup'); },
    removeItem() { removed = true; }
  };
  const workspace = createCVWorkspaceController({surface:makeSurface(),storage:store});
  assert.equal(workspace.getState().documents.length,1);
  assert.equal(removed,false);
});
