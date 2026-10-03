import { createCVWorkspace } from '../application/cv-workspace.js';
import { createEditorSession } from '../application/editor-session.js';

export const CV_WORKSPACE_CONTROLLER_VERSION = '1.0.0';

const clone = value => value == null ? value : JSON.parse(JSON.stringify(value));

function createVersionSnapshot(document, masterProfile) {
  const versionId = 'v-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
  return {
    id: versionId,
    documentId: document.id,
    createdAt: new Date().toISOString(),
    revision: document.revision || 0,
    title: document.title || 'Untitled CV',
    targetedCV: clone(document),
    masterProfile: clone(masterProfile)
  };
}

export function createCVWorkspaceController(options = {}) {
  const storage = options.storage || null;
  const storageKey = options.storageKey || 'estudent_cv_workspace_v2_2027';
  const surface = options.surface;
  if (!surface?.getState) throw new Error('Workspace controller requires an editor surface.');

  const initial = surface.getState().session.application;
  const workspace = createCVWorkspace({
    masterProfile: clone(initial.masterProfile),
    documents: [clone(initial.targetedCV)],
    activeDocumentId: initial.targetedCV.id
  });

  let versions = {};
  let destroyed = false;

  const loadState = () => {
    if (!storage?.getItem) return;
    try {
      const raw = storage.getItem(storageKey);
      if (!raw) return;
      const payload = JSON.parse(raw);
      if (payload?.version !== CV_WORKSPACE_CONTROLLER_VERSION || !payload.workspace) return;
      workspace.replaceState(payload.workspace, { type: 'load-workspace' });
      versions = payload.versions && typeof payload.versions === 'object' ? payload.versions : {};
    } catch {
      storage.removeItem?.(storageKey);
    }
  };

  loadState();

  const saveState = () => {
    if (!storage?.setItem) return;
    const payload = {
      version: CV_WORKSPACE_CONTROLLER_VERSION,
      workspace: workspace.getState(),
      versions
    };
    storage.setItem(storageKey, JSON.stringify(payload));
  };

  const recordVersion = () => {
    const state = surface.getState().session.application;
    const document = state.targetedCV;
    const snapshot = createVersionSnapshot(document, state.masterProfile);
    versions[document.id] = [...(versions[document.id] || []), snapshot].slice(-20);
    saveState();
    return snapshot;
  };

  const syncActive = () => {
    const state = surface.getState().session.application;
    const current = workspace.getState();
    const documents = current.documents.map(document =>
      document.id === current.activeDocumentId ? clone(state.targetedCV) : document
    );
    workspace.replaceState({
      ...current,
      masterProfile: clone(state.masterProfile),
      documents
    }, { type: 'sync-active-document', documentId: current.activeDocumentId });
  };

  const restoreDocument = (documentId, options = {}) => {
    if (destroyed) return null;
    if (options.sync !== false) syncActive();
    const document = workspace.getDocument(documentId);
    if (!document) throw new Error('CV document not found: ' + documentId);
    workspace.setActiveDocument(documentId);
    const state = surface.getState();
    surface.restorePersistedState({
      version: '1.0.0',
      savedAt: new Date().toISOString(),
      application: {
        version: state.session.application.version,
        masterProfile: clone(workspace.getState().masterProfile),
        targetedCV: clone(document)
      },
      session: clone(state.session.session)
    });
    saveState();
    return document;
  };

  const createDocument = title => {
    if (destroyed) return null;
    syncActive();
    const next = workspace.addDocument({ title: title || 'New CV' });
    // The workspace already contains the newly created document; do not sync
    // the old editor document over it before restoring the new active document.
    restoreDocument(next.activeDocumentId, { sync: false });
    return next;
  };

  const duplicateDocument = () => {
    if (destroyed) return null;
    syncActive();
    const active = workspace.getActiveDocument();
    const copy = workspace.duplicateDocument(active.id, { title: (active.title || 'CV') + ' Copy' });
    // The duplicate is already in workspace state; restore it without syncing
    // the previous editor document back over the duplicate.
    restoreDocument(copy.id, { sync: false });
    return copy;
  };

  const renameActive = title => {
    syncActive();
    const id = workspace.getState().activeDocumentId;
    workspace.renameDocument(id, title);
    saveState();
    return workspace.getDocument(id);
  };

  const archiveActive = () => {
    syncActive();
    const active = workspace.getActiveDocument();
    workspace.archiveDocument(active.id);
    const nextId = workspace.getState().activeDocumentId;
    // The archived document must not be synced into the replacement active CV.
    restoreDocument(nextId, { sync: false });
    saveState();
    return workspace.getState();
  };

  const restoreVersion = (documentId, versionId) => {
    const list = versions[documentId] || [];
    const version = list.find(item => item.id === versionId);
    if (!version) throw new Error('CV version not found: ' + versionId);
    workspace.replaceState({
      ...workspace.getState(),
      masterProfile: clone(version.masterProfile),
      documents: workspace.getState().documents.map(document =>
        document.id === documentId ? clone(version.targetedCV) : document
      ),
      activeDocumentId: documentId
    }, { type: 'restore-version', documentId, versionId });
    versions[documentId] = [...list, createVersionSnapshot(version.targetedCV, version.masterProfile)].slice(-20);
    restoreDocument(documentId, { sync: false });
    saveState();
    return version;
  };

  return Object.freeze({
    version: CV_WORKSPACE_CONTROLLER_VERSION,
    workspace,
    getState: () => workspace.getState(),
    getDiagnostics: () => workspace.getDiagnostics(),
    getActiveDocument: () => workspace.getActiveDocument(),
    getDocument: documentId => workspace.getDocument(documentId),
    getVersions: documentId => Object.freeze([...(versions[documentId] || [])].reverse()),
    hasStoredWorkspace: () => Boolean(storage?.getItem?.(storageKey)),
    createDocument,
    duplicateDocument,
    renameActive,
    archiveActive,
    switchDocument: restoreDocument,
    recordVersion,
    restoreVersion,
    save: () => { syncActive(); recordVersion(); saveState(); return workspace.getState(); },
    destroy: () => { destroyed = true; workspace.destroy(); }
  });
}
