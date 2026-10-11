import { createCVWorkspace } from '../application/cv-workspace.js';
import { createEditorSession } from '../application/editor-session.js';
import { migrateSkillsLanguagesProfile, migrateSkillsLanguagesTargetedCV, SKILLS_LANGUAGES_SCHEMA_VERSION } from '../core/skills-languages.js';

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
      const savedWorkspace = payload.workspace;
      let savedProfile = clone(savedWorkspace.masterProfile);
      const hasLegacySkillsLanguages = (savedProfile?.careerData?.sections || []).some(section =>
        ['skills','languages'].includes(String(section?.type)) &&
        (section?.metadata?.skillsLanguagesSchema !== SKILLS_LANGUAGES_SCHEMA_VERSION ||
          (Array.isArray(section?.fields) && section.fields.length > 0))
      );
      // Workspace persistence predates the CV application's normalizing path.
      // Re-migrate legacy Skills/Languages on load so old localStorage data is
      // converted to canonical entries before the editor and preview render it.
      if (hasLegacySkillsLanguages) savedProfile = migrateSkillsLanguagesProfile(savedProfile);
      const savedDocuments = (Array.isArray(savedWorkspace.documents) ? savedWorkspace.documents : []).map(document =>
        hasLegacySkillsLanguages
          ? migrateSkillsLanguagesTargetedCV(document, savedProfile)
          : document
      );
      workspace.replaceState({
        ...savedWorkspace,
        masterProfile: savedProfile,
        documents: savedDocuments
      }, { type: 'load-workspace' });
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

  const sameVersionContent = (left, document, masterProfile) =>
    Boolean(left && JSON.stringify(left.targetedCV) === JSON.stringify(document) &&
      JSON.stringify(left.masterProfile) === JSON.stringify(masterProfile));

  const recordVersion = (documentOverride, profileOverride) => {
    const state = surface.getState().session.application;
    const document = clone(documentOverride || state.targetedCV);
    const masterProfile = clone(profileOverride || state.masterProfile);
    const list = versions[document.id] || [];
    const latest = list[list.length - 1];
    // Repeated saves of unchanged content should not create noisy history entries.
    if (sameVersionContent(latest, document, masterProfile)) return latest;
    const snapshot = createVersionSnapshot(document, masterProfile);
    versions[document.id] = [...list, snapshot].slice(-20);
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
    // Capture the actual current editor state before changing workspace state,
    // so an unsaved edit remains recoverable even when an older version is restored.
    const liveApplication = surface.getState().session.application;
    const currentDocument = liveApplication.targetedCV;
    const currentProfile = liveApplication.masterProfile;
    if (currentDocument?.id === documentId) recordVersion(currentDocument, currentProfile);
    workspace.replaceState({
      ...workspace.getState(),
      masterProfile: clone(version.masterProfile),
      documents: workspace.getState().documents.map(document =>
        document.id === documentId ? clone(version.targetedCV) : document
      ),
      activeDocumentId: documentId
    }, { type: 'restore-version', documentId, versionId });
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
