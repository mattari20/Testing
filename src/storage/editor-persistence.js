import { validateM1, toSerializable } from '../core/career-document-core.js';

export const EDITOR_PERSISTENCE_VERSION = '1.0.0';
export const EDITOR_PERSISTENCE_KEY = 'cv_builder_v2_editor_state';

const clone = value => value == null ? value : JSON.parse(JSON.stringify(value));

export function createEditorPersistenceRecord(session, options = {}) {
  if (!session?.application?.masterProfile || !session?.application?.targetedCV) {
    throw new Error('A complete editor session is required for persistence.');
  }
  const validation = validateM1(session.application.masterProfile, session.application.targetedCV);
  if (!validation.valid) throw new Error('Cannot persist an invalid CV document.');
  return Object.freeze({
    version: EDITOR_PERSISTENCE_VERSION,
    savedAt: options.savedAt || new Date().toISOString(),
    session: toSerializable(session.session || {}),
    application: {
      version: session.application.version,
      masterProfile: toSerializable(session.application.masterProfile),
      targetedCV: toSerializable(session.application.targetedCV)
    }
  });
}

export function serializeEditorPersistenceRecord(record) {
  if (!record || record.version !== EDITOR_PERSISTENCE_VERSION) {
    throw new Error('Unsupported editor persistence record.');
  }
  return JSON.stringify(clone(record));
}

export function deserializeEditorPersistenceRecord(serialized) {
  if (!serialized) return null;
  const record = JSON.parse(String(serialized));
  if (!record || record.version !== EDITOR_PERSISTENCE_VERSION) {
    throw new Error('Unsupported editor persistence version.');
  }
  const validation = validateM1(record.application?.masterProfile, record.application?.targetedCV);
  if (!validation.valid) throw new Error('Persisted CV document is invalid.');
  return record;
}

export function createEditorPersistenceAdapter(storage, key = EDITOR_PERSISTENCE_KEY) {
  if (!storage || typeof storage.getItem !== 'function' || typeof storage.setItem !== 'function') {
    throw new Error('Editor persistence requires getItem and setItem.');
  }
  return {
    load() {
      return deserializeEditorPersistenceRecord(storage.getItem(key));
    },
    save(session) {
      const record = createEditorPersistenceRecord(session);
      storage.setItem(key, serializeEditorPersistenceRecord(record));
      return record;
    },
    clear() {
      if (typeof storage.removeItem === 'function') storage.removeItem(key);
    }
  };
}

export function createEditorRecoveryController(surface, adapter, options = {}) {
  if (!surface || typeof surface.getState !== 'function' || typeof surface.subscribe !== 'function') {
    throw new Error('A valid editor surface is required.');
  }
  if (!adapter || typeof adapter.save !== 'function' || typeof adapter.load !== 'function') {
    throw new Error('A valid persistence adapter is required.');
  }

  const delayMs = Number.isFinite(options.delayMs) ? Math.max(0, options.delayMs) : 250;
  let timer = null;
  let destroyed = false;
  let autosaveStatus = 'idle';
  let lastAutosavedAt = null;
  let lastAutosaveError = null;
  const subscribers = new Set();
  const emit = () => {
    const snapshot = Object.freeze({ autosaveStatus, lastAutosavedAt, lastAutosaveError });
    subscribers.forEach(listener => listener(snapshot));
    return snapshot;
  };

  const flush = () => {
    if (destroyed) return null;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    const state = surface.getState();
    if (!state.session.dirty) {
      autosaveStatus = 'idle';
      emit();
      return null;
    }
    autosaveStatus = 'saving';
    lastAutosaveError = null;
    emit();
    try {
      const record = adapter.save(state.session);
      lastAutosavedAt = record?.savedAt || new Date().toISOString();
      autosaveStatus = 'saved';
      emit();
      return record;
    } catch (error) {
      autosaveStatus = 'error';
      lastAutosaveError = String(error?.message || error);
      emit();
      throw error;
    }
  };

  const schedule = () => {
    if (destroyed) return;
    if (timer) clearTimeout(timer);
    autosaveStatus = 'scheduled';
    lastAutosaveError = null;
    emit();
    timer = setTimeout(() => {
      timer = null;
      try { flush(); } catch { /* error state is emitted by flush */ }
    }, delayMs);
  };

  const unsubscribe = surface.subscribe((state, command) => {
    if (command?.type === 'restore' || command?.type === 'save') return;
    if (command?.mutatesData === true || command?.type === 'undo' || command?.type === 'redo') schedule();
  });

  const save = () => {
    if (destroyed) return null;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    const state = surface.getState();
    const savedAt = new Date().toISOString();
    const cleanSession = {
      ...state.session,
      dirty: false,
      savedAt,
      lastCommand: 'save'
    };
    const record = adapter.save(cleanSession);
    if (typeof surface.markSaved === 'function') surface.markSaved(record?.savedAt || savedAt);
    return record;
  };

  return Object.freeze({
    flush,
    save,
    getState() {
      return Object.freeze({ autosaveStatus, lastAutosavedAt, lastAutosaveError });
    },
    subscribe(listener) {
      if (typeof listener !== 'function') throw new Error('Recovery subscriber must be a function.');
      subscribers.add(listener);
      listener(this.getState());
      return () => subscribers.delete(listener);
    },
    hasRecovery() {
      return Boolean(adapter.load());
    },
    recover() {
      if (destroyed) return null;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      const record = adapter.load();
      if (!record) return null;
      if (typeof surface.restorePersistedState !== 'function') {
        throw new Error('Editor surface does not support persisted-state recovery.');
      }
      surface.restorePersistedState(record);
      return record;
    },
    clear() {
      if (destroyed) return;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      adapter.clear?.();
      autosaveStatus = 'idle';
      lastAutosaveError = null;
      emit();
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      if (timer) clearTimeout(timer);
      timer = null;
      unsubscribe();
      subscribers.clear();
    }
  });
}
