export const LOCAL_SESSION_VERSION = '1.0.0';

export const SESSION_KEY = 'cv_builder_v2_session';

function clone(value){return value == null ? value : JSON.parse(JSON.stringify(value));}

export function createLocalFirstSession(input = {}) {
  return {
    version: LOCAL_SESSION_VERSION,
    sessionId: String(input.sessionId || 'session_' + Date.now().toString(36)),
    masterProfileId: input.masterProfileId || null,
    targetedCVId: input.targetedCVId || null,
    activeRevision: input.activeRevision || null,
    updatedAt: input.updatedAt || new Date().toISOString()
  };
}

export function serializeLocalFirstSession(session) {
  return JSON.stringify(clone(session));
}

export function deserializeLocalFirstSession(serialized) {
  if (!serialized) return null;
  const value = JSON.parse(String(serialized));
  if (!value || value.version !== LOCAL_SESSION_VERSION) throw new Error('Unsupported local session version.');
  return value;
}

export function createStorageAdapter(storage) {
  if (!storage || typeof storage.getItem !== 'function' || typeof storage.setItem !== 'function') {
    throw new Error('Storage adapter requires getItem and setItem.');
  }
  return {
    load(){ return deserializeLocalFirstSession(storage.getItem(SESSION_KEY)); },
    save(session){ storage.setItem(SESSION_KEY, serializeLocalFirstSession(session)); return session; },
    clear(){ if (typeof storage.removeItem === 'function') storage.removeItem(SESSION_KEY); }
  };
}
