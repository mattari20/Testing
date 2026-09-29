export const EDITOR_PERSISTENCE_VERSION = '1.0.0';

export function createEditorPersistence(adapter) {
  if (!adapter || typeof adapter.get !== 'function' || typeof adapter.set !== 'function') {
    throw new Error('A storage adapter with get/set is required.');
  }
  return Object.freeze({
    load(key, fallback = null) {
      const value = adapter.get(key);
      return value == null ? fallback : value;
    },
    save(key, value) {
      adapter.set(key, value);
      return value;
    },
    remove(key) {
      if (typeof adapter.remove === 'function') adapter.remove(key);
    }
  });
}

export function serializeEditorSession(session) {
  if (!session?.application) throw new Error('Editor session is required.');
  return JSON.stringify({
    version: EDITOR_PERSISTENCE_VERSION,
    masterProfile: session.application.masterProfile,
    targetedCV: session.application.targetedCV,
    dirty: session.dirty,
    lastCommand: session.lastCommand || null
  });
}
