import { createMasterProfile, createTargetedCV, cloneTargetedCV, validateM1 } from '../core/career-document-core.js';
export const CV_WORKSPACE_VERSION = '1.0.0';
const clone = value => value == null ? value : JSON.parse(JSON.stringify(value));
const freezeSnapshot = value => Object.freeze(clone(value));
const now = () => new Date().toISOString();

function assertValid(masterProfile, documents) {
  if (!masterProfile?.id) throw new Error('Workspace requires a master profile.');
  if (!Array.isArray(documents) || documents.length === 0) throw new Error('Workspace requires at least one CV document.');
  const ids = new Set();
  for (const document of documents) {
    if (ids.has(document.id)) throw new Error('Duplicate CV document id: ' + document.id);
    ids.add(document.id);
    const validation = validateM1(masterProfile, document);
    if (!validation.valid) throw new Error('Invalid CV document: ' + document.id);
  }
}
function lineage(document, parentDocumentId = null) {
  const metadata = document.metadata && typeof document.metadata === 'object' ? clone(document.metadata) : {};
  const existing = metadata.versionLineage && typeof metadata.versionLineage === 'object' ? metadata.versionLineage : {};
  return { rootDocumentId: existing.rootDocumentId || document.id, parentDocumentId: parentDocumentId || existing.parentDocumentId || null, createdAt: existing.createdAt || document.createdAt || now(), sourceRevision: existing.sourceRevision || null };
}
export function createCVWorkspace(input = {}) {
  const masterProfile = input.masterProfile || createMasterProfile(input.profileData || {});
  const supplied = Array.isArray(input.documents) ? input.documents.map(clone) : [];
  const documents = supplied.length ? supplied : [createTargetedCV({ masterProfileId: masterProfile.id, ...(input.cvData || {}) })];
  assertValid(masterProfile, documents);
  const activeDocumentId = input.activeDocumentId && documents.some(d => d.id === input.activeDocumentId) ? input.activeDocumentId : documents[0].id;
  let state = { version: CV_WORKSPACE_VERSION, masterProfile, documents, activeDocumentId, history: [], updatedAt: now() };
  const subscribers = new Set(); let destroyed = false;
  const snapshot = () => freezeSnapshot(state);
  const commit = (type, details = {}) => {
    state = { ...state, updatedAt: now(), history: [...state.history, { type, at: now(), ...clone(details) }] };
    if (state.history.length > 50) state.history = state.history.slice(-50);
    const current = snapshot(); subscribers.forEach(listener => listener(current, type)); return current;
  };
  return Object.freeze({
    version: CV_WORKSPACE_VERSION,
    getState: snapshot,
    subscribe(listener) { if (typeof listener !== 'function') throw new Error('Workspace subscriber must be a function.'); if (destroyed) return () => {}; subscribers.add(listener); listener(snapshot(), 'subscribe'); return () => subscribers.delete(listener); },
    getActiveDocument() { return freezeSnapshot(state.documents.find(d => d.id === state.activeDocumentId) || null); },
    getDocument(documentId) { return freezeSnapshot(state.documents.find(d => d.id === String(documentId)) || null); },
    replaceState(nextState, details = {}) {
      if (destroyed) return null;
      const next = clone(nextState);
      assertValid(next.masterProfile, next.documents);
      if (!next.documents.some(d => d.id === String(next.activeDocumentId))) throw new Error('Replacement state active document is invalid.');
      state = { version: CV_WORKSPACE_VERSION, masterProfile: next.masterProfile, documents: next.documents, activeDocumentId: String(next.activeDocumentId), history: Array.isArray(next.history) ? next.history.slice(-50) : state.history, updatedAt: now() };
      return commit(details.type || 'replace-state', details);
    },
    setActiveDocument(documentId) { if (destroyed) return null; const id = String(documentId); if (!state.documents.some(d => d.id === id)) throw new Error('CV document not found: ' + id); if (id === state.activeDocumentId) return snapshot(); state = { ...state, activeDocumentId: id }; return commit('activate-document', { documentId: id }); },
    addDocument(input = {}) { if (destroyed) return null; const document = createTargetedCV({ masterProfileId: state.masterProfile.id, ...clone(input) }); document.metadata = { ...(document.metadata || {}), versionLineage: lineage(document) }; state = { ...state, documents: [...state.documents, document], activeDocumentId: document.id }; return commit('add-document', { documentId: document.id }); },
    duplicateDocument(documentId, options = {}) { if (destroyed) return null; const source = state.documents.find(d => d.id === String(documentId)); if (!source) throw new Error('CV document not found: ' + documentId); const copy = cloneTargetedCV(source, options); const sourceLineage = lineage(source); copy.metadata = { ...(copy.metadata || {}), versionLineage: { rootDocumentId: sourceLineage.rootDocumentId, parentDocumentId: source.id, createdAt: now(), sourceRevision: source.revision } }; state = { ...state, documents: [...state.documents, copy], activeDocumentId: copy.id }; commit('duplicate-document', { documentId: copy.id, sourceDocumentId: source.id }); return freezeSnapshot(copy); },
    renameDocument(documentId, title) { if (destroyed) return null; const id = String(documentId); const documents = state.documents.map(d => d.id === id ? { ...d, title: String(title ?? ''), updatedAt: now() } : d); if (!documents.some(d => d.id === id)) throw new Error('CV document not found: ' + id); state = { ...state, documents }; return commit('rename-document', { documentId: id }); },
    archiveDocument(documentId) { if (destroyed) return null; const id = String(documentId); const target = state.documents.find(d => d.id === id); if (!target) throw new Error('CV document not found: ' + id); const documents = state.documents.map(d => d.id === id ? { ...d, status: 'archived', state: { ...d.state, kind: 'archived' }, updatedAt: now() } : d); state = { ...state, documents }; if (state.activeDocumentId === id) { const replacement = documents.find(d => d.id !== id && d.status !== 'archived') || documents.find(d => d.id !== id) || target; state = { ...state, activeDocumentId: replacement.id }; } return commit('archive-document', { documentId: id, activeDocumentId: state.activeDocumentId }); },
    getDiagnostics() { const documents = state.documents; return Object.freeze({ workspaceVersion: CV_WORKSPACE_VERSION, masterProfileId: state.masterProfile.id, documentCount: documents.length, activeDocumentId: state.activeDocumentId, activeDocumentExists: documents.some(d => d.id === state.activeDocumentId), archivedCount: documents.filter(d => d.status === 'archived').length, draftCount: documents.filter(d => d.status === 'draft').length, latestUpdatedAt: documents.reduce((latest, d) => d.updatedAt > latest ? d.updatedAt : latest, ''), historyLength: state.history.length }); },
    destroy() { if (destroyed) return; destroyed = true; subscribers.clear(); }
  });
}