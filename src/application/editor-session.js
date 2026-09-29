import { createCVApplication, createApplicationSnapshot } from './cv-application.js';
import { createLocalFirstSession } from '../storage/local-first-session.js';

export const EDITOR_SESSION_VERSION = '1.0.0';

export function createEditorSession(input = {}) {
  const application = createCVApplication(input);
  const session = createLocalFirstSession({
    masterProfileId: application.masterProfile.id,
    targetedCVId: application.targetedCV.id,
    activeRevision: application.targetedCV.revision || null
  });
  return Object.freeze({
    version: EDITOR_SESSION_VERSION,
    application,
    session,
    snapshot: createApplicationSnapshot(application),
    dirty: false,
    lastCommand: null
  });
}

export function applyEditorCommand(editorSession, command = {}) {
  if (!editorSession?.application) throw new Error('Editor session is required.');
  if (!command.type) throw new Error('Editor command type is required.');
  return Object.freeze({
    ...editorSession,
    lastCommand: String(command.type),
    dirty: command.mutatesData === true ? true : editorSession.dirty
  });
}

export function markEditorSaved(editorSession) {
  return Object.freeze({
    ...editorSession,
    dirty: false,
    savedAt: new Date().toISOString()
  });
}
