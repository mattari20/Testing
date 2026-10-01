import { validateM1, toSerializable } from '../core/career-document-core.js';

export const EDITOR_PERSISTENCE_VERSION = '1.0.0';
export const EDITOR_PERSISTENCE_KEY = 'cv_builder_v2_editor_state';

const clone = value => value == null ? value : JSON.parse(JSON.stringify(value));

function fingerprint(value) {
  const input = JSON.stringify(value);
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

function createSnapshotContentId(session, application) {
  const sessionData = clone(session || {});
  delete sessionData.savedAt;
  delete sessionData.lastCommand;
  delete sessionData.dirty;
  return `c-${fingerprint({ session: sessionData, application })}`;
}

export function createEditorPersistenceRecord(session, options = {}) {
  if (!session?.application?.masterProfile || !session?.application?.targetedCV) {
    throw new Error('A complete editor session is required for persistence.');
  }
  const validation = validateM1(session.application.masterProfile, session.application.targetedCV);
  if (!validation.valid) throw new Error('Cannot persist an invalid CV document.');
  const savedAt = options.savedAt || new Date().toISOString();
  const revision = Number.isInteger(options.revision) && options.revision > 0 ? options.revision : 1;
  const application = {
    version: session.application.version,
    masterProfile: toSerializable(session.application.masterProfile),
    targetedCV: toSerializable(session.application.targetedCV)
  };
  const sessionData = toSerializable(session.session || {});
  const snapshotContentId = createSnapshotContentId(sessionData, application);
  const identity = fingerprint({
    version: EDITOR_PERSISTENCE_VERSION,
    savedAt,
    revision,
    snapshotContentId,
    session: sessionData,
    application
  });
  return Object.freeze({
    version: EDITOR_PERSISTENCE_VERSION,
    savedAt,
    revision,
    snapshotId: `s-${identity}`,
    snapshotContentId,
    session: sessionData,
    application
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
  if (record.snapshotId != null) {
    const expected = `s-${fingerprint({
      version: record.version,
      savedAt: record.savedAt,
      revision: record.revision,
      snapshotContentId: record.snapshotContentId,
      session: record.session,
      application: record.application
    })}`;
    if (record.snapshotId !== expected) throw new Error('Persisted CV snapshot identity is invalid.');
  }
  if (record.snapshotContentId != null) {
    const expectedContentId = createSnapshotContentId(record.session, record.application);
    if (record.snapshotContentId !== expectedContentId) {
      throw new Error('Persisted CV snapshot content identity is invalid.');
    }
  }
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
      let currentRevision = 0;
      try {
        currentRevision = Number(deserializeEditorPersistenceRecord(storage.getItem(key))?.revision) || 0;
      } catch {
        // Replace invalid snapshots with a fresh valid revision.
      }
      const record = createEditorPersistenceRecord(session, { revision: currentRevision + 1 });
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
  const maxRetries = Number.isInteger(options.maxRetries) ? Math.max(0, options.maxRetries) : 2;
  const retryDelayMs = Number.isFinite(options.retryDelayMs) ? Math.max(0, options.retryDelayMs) : delayMs;
  let timer = null;
  let retryTimer = null;
  let retryCount = 0;
  let operationToken = 0;
  let destroyed = false;
  let autosaveStatus = 'idle';
  let lastAutosavedAt = null;
  let lastAutosaveError = null;
  let recoveryStatus = 'missing';
  let recoveryError = null;
  let recoverySavedAt = null;
  let recoveryRevision = null;
  let recoverySnapshotId = null;
  let recoverySnapshotContentId = null;
  let recoveryIsNewer = false;
  let recoveryRelation = 'missing';
  let recoveryContentRelation = 'missing';
  let recoveryDecision = 'none';
  let recoveryActionRequired = false;
  let recoveryAction = 'none';
  let recoveryLastAction = null;
  let recoveryAuditSequence = 0;
  const recoveryAudit = [];
  const MAX_RECOVERY_AUDIT = 12;
  const subscribers = new Set();

  const emit = () => {
    const snapshot = Object.freeze({
      autosaveStatus,
      lastAutosavedAt,
      lastAutosaveError,
      recoveryStatus,
      recoveryError,
      recoverySavedAt,
      recoveryRevision,
      recoverySnapshotId,
      recoverySnapshotContentId,
      recoveryIsNewer,
      recoveryRelation,
      recoveryContentRelation,
      recoveryDecision,
      recoveryActionRequired,
      recoveryAction,
      recoveryLastAction,
      recoveryAudit: recoveryAudit.map(entry => ({ ...entry })),
      retryCount,
      maxRetries
    });
    subscribers.forEach(listener => listener(snapshot));
    return snapshot;
  };

  const classifyRecoveryError = error => {
    const message = String(error?.message || error);
    const invalid = error instanceof SyntaxError
      || /Unsupported editor persistence|Persisted CV document is invalid|Persisted CV snapshot identity is invalid|Persisted CV snapshot content identity is invalid/i.test(message);
    return invalid ? 'invalid' : 'error';
  };

  const currentContentId = () => {
    const state = surface.getState();
    const application = {
      version: state.session.application?.version,
      masterProfile: toSerializable(state.session.application?.masterProfile),
      targetedCV: toSerializable(state.session.application?.targetedCV)
    };
    return createSnapshotContentId(state.session.session, application);
  };

  const compareRecoveryFreshness = record => {
    if (!record?.savedAt) return 'unknown';
    const currentSavedAt = surface.getState().session.savedAt || null;
    if (!currentSavedAt) return 'newer';
    const persistedTime = new Date(record.savedAt).getTime();
    const currentTime = new Date(currentSavedAt).getTime();
    if (!Number.isFinite(persistedTime) || !Number.isFinite(currentTime)) return 'unknown';
    if (persistedTime > currentTime) return 'newer';
    if (persistedTime < currentTime) return 'older';
    return 'same';
  };

  const compareRecoveryContent = record => {
    if (!record?.snapshotContentId) return 'unknown';
    const currentId = currentContentId();
    if (!currentId) return 'unknown';
    return currentId === record.snapshotContentId ? 'same' : 'different';
  };

  const deriveRecoveryDecision = (record, contentRelation = recoveryContentRelation, freshness = recoveryRelation) => {
    if (!record) return 'none';
    if (contentRelation === 'same') return 'safe';
    if (contentRelation === 'different' && freshness === 'older') return 'stale';
    if (contentRelation === 'different') return 'confirm';
    return 'unknown';
  };

  const updateRecoveryActionState = () => {
    recoveryActionRequired = recoveryDecision === 'confirm' || recoveryDecision === 'stale';
    if (!recoveryActionRequired) {
      if (recoveryAction !== 'resolved' && recoveryAction !== 'dismissed') recoveryAction = 'none';
    } else if (recoveryAction === 'none') {
      recoveryAction = 'pending';
    }
  };

  const recordRecoveryEvent = (type, outcome, reason = null) => {
    recoveryAuditSequence += 1;
    const event = Object.freeze({
      id: `ra-${recoveryAuditSequence}`,
      type,
      at: new Date().toISOString(),
      decision: recoveryDecision,
      relation: recoveryRelation,
      contentRelation: recoveryContentRelation,
      snapshotId: recoverySnapshotId,
      revision: recoveryRevision,
      outcome,
      reason
    });
    recoveryAudit.push(event);
    while (recoveryAudit.length > MAX_RECOVERY_AUDIT) recoveryAudit.shift();
    recoveryLastAction = event;
    return event;
  };

  const inspectRecovery = () => {
    try {
      const record = adapter.load();
      recoveryStatus = record ? 'available' : 'missing';
      recoverySavedAt = record?.savedAt || null;
      recoveryRevision = Number.isInteger(record?.revision) ? record.revision : null;
      recoverySnapshotId = record?.snapshotId || null;
      recoverySnapshotContentId = record?.snapshotContentId || null;
      recoveryRelation = compareRecoveryFreshness(record);
      recoveryContentRelation = compareRecoveryContent(record);
      recoveryIsNewer = recoveryRelation === 'newer';
      recoveryDecision = deriveRecoveryDecision(record, recoveryContentRelation, recoveryRelation);
      updateRecoveryActionState();
      recoveryError = null;
      return record;
    } catch (error) {
      recoveryStatus = classifyRecoveryError(error);
      recoverySavedAt = null;
      recoveryRevision = null;
      recoverySnapshotId = null;
      recoverySnapshotContentId = null;
      recoveryIsNewer = false;
      recoveryRelation = 'unknown';
      recoveryContentRelation = 'unknown';
      recoveryDecision = 'unknown';
      updateRecoveryActionState();
      recoveryError = String(error?.message || error);
      return null;
    }
  };

  const applyPersistedMetadata = (record, relation = 'same') => {
    recoveryStatus = record ? 'available' : 'missing';
    recoverySavedAt = record?.savedAt || null;
    recoveryRevision = Number.isInteger(record?.revision) ? record.revision : null;
    recoverySnapshotId = record?.snapshotId || null;
    recoverySnapshotContentId = record?.snapshotContentId || null;
    recoveryRelation = relation;
    recoveryContentRelation = record?.snapshotContentId ? 'same' : 'unknown';
    recoveryIsNewer = relation === 'newer';
    recoveryDecision = deriveRecoveryDecision(record, recoveryContentRelation, recoveryRelation);
    updateRecoveryActionState();
    recoveryError = null;
  };

  const runFlush = token => {
    if (destroyed || token !== operationToken) return null;
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
      retryCount = 0;
      lastAutosavedAt = record?.savedAt || new Date().toISOString();
      autosaveStatus = 'saved';
      applyPersistedMetadata(record, 'same');
      updateRecoveryActionState();
      emit();
      return record;
    } catch (error) {
      lastAutosaveError = String(error?.message || error);
      if (retryCount < maxRetries && !destroyed) {
        retryCount += 1;
        autosaveStatus = 'scheduled';
        emit();
        if (retryTimer) clearTimeout(retryTimer);
        const retryToken = operationToken;
        retryTimer = setTimeout(() => {
          retryTimer = null;
          if (retryToken !== operationToken || destroyed) return;
          try { runFlush(retryToken); } catch { /* error state is emitted by runFlush */ }
        }, retryDelayMs * retryCount);
        return null;
      }
      autosaveStatus = 'error';
      emit();
      throw error;
    }
  };

  const schedule = () => {
    if (destroyed) return;
    const scheduleToken = ++operationToken;
    if (timer) clearTimeout(timer);
    autosaveStatus = 'scheduled';
    lastAutosaveError = null;
    retryCount = 0;
    if (retryTimer) {
      clearTimeout(retryTimer);
      retryTimer = null;
    }
    emit();
    timer = setTimeout(() => {
      timer = null;
      if (scheduleToken !== operationToken || destroyed) return;
      try { runFlush(scheduleToken); } catch { /* error state is emitted by runFlush */ }
    }, delayMs);
  };

  const flush = () => runFlush(++operationToken);

  const unsubscribe = surface.subscribe((state, command) => {
    if (command?.type === 'restore' || command?.type === 'save') return;
    if (command?.mutatesData === true || command?.type === 'undo' || command?.type === 'redo') schedule();
  });

  const save = () => {
    if (destroyed) return null;
    ++operationToken;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (retryTimer) {
      clearTimeout(retryTimer);
      retryTimer = null;
    }
    retryCount = 0;
    const state = surface.getState();
    const savedAt = new Date().toISOString();
    const cleanSession = {
      ...state.session,
      dirty: false,
      savedAt,
      lastCommand: 'save'
    };
    autosaveStatus = 'saving';
    lastAutosaveError = null;
    emit();
    try {
      const record = adapter.save(cleanSession);
      const effectiveSavedAt = record?.savedAt || savedAt;
      lastAutosavedAt = effectiveSavedAt;
      autosaveStatus = 'saved';
      applyPersistedMetadata(record, 'same');
      if (typeof surface.markSaved === 'function') surface.markSaved(effectiveSavedAt);
      emit();
      return record;
    } catch (error) {
      autosaveStatus = 'error';
      lastAutosaveError = String(error?.message || error);
      emit();
      throw error;
    }
  };

  return Object.freeze({
    flush,
    save,
    getState() {
      inspectRecovery();
      return Object.freeze({
        autosaveStatus,
        lastAutosavedAt,
        lastAutosaveError,
        recoveryStatus,
        recoveryError,
        recoverySavedAt,
        recoveryRevision,
        recoverySnapshotId,
        recoverySnapshotContentId,
        recoveryIsNewer,
        recoveryRelation,
        recoveryContentRelation,
        recoveryDecision,
        recoveryActionRequired,
        recoveryAction,
        recoveryLastAction,
        recoveryAudit: recoveryAudit.map(entry => ({ ...entry })),
        retryCount,
        maxRetries
      });
    },
    getRecoveryAudit() {
      return recoveryAudit.map(entry => ({ ...entry }));
    },
    getRecoveryState() {
      inspectRecovery();
      return Object.freeze({
        recoveryStatus,
        recoveryError,
        recoverySavedAt,
        recoveryRevision,
        recoverySnapshotId,
        recoverySnapshotContentId,
        recoveryIsNewer,
        recoveryRelation,
        recoveryContentRelation,
        recoveryDecision,
        recoveryActionRequired,
        recoveryAction,
        recoveryLastAction,
        recoveryAudit: recoveryAudit.map(entry => ({ ...entry }))
      });
    },
    subscribe(listener) {
      if (typeof listener !== 'function') throw new Error('Recovery subscriber must be a function.');
      subscribers.add(listener);
      listener(this.getState());
      return () => subscribers.delete(listener);
    },
    hasRecovery() {
      return Boolean(inspectRecovery());
    },
    resolveRecovery(action, options = {}) {
      if (destroyed) return null;
      if (action !== 'recover' && action !== 'dismiss') {
        throw new Error('Recovery action must be recover or dismiss.');
      }
      const state = this.getRecoveryState();
      if (!state.recoveryActionRequired) return null;
      if (action === 'recover') {
        recoveryAction = 'recovering';
        emit();
        const record = this.recover(options);
        if (record) recoveryAction = 'resolved';
        else recoveryAction = 'pending';
        emit();
        return record;
      }
      ++operationToken;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      if (retryTimer) {
        clearTimeout(retryTimer);
        retryTimer = null;
      }
      retryCount = 0;
      adapter.clear?.();
      recoveryAction = 'dismissed';
      recoveryActionRequired = false;
      recoveryStatus = 'missing';
      recoverySavedAt = null;
      recoveryRevision = null;
      recoverySnapshotId = null;
      recoverySnapshotContentId = null;
      recoveryIsNewer = false;
      recoveryRelation = 'missing';
      recoveryContentRelation = 'missing';
      recoveryDecision = 'none';
      recoveryError = null;
      recordRecoveryEvent('dismiss', 'dismissed');
      emit();
      return true;
    },
    recover(options = {}) {
      if (destroyed) return null;
      ++operationToken;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      if (retryTimer) {
        clearTimeout(retryTimer);
        retryTimer = null;
      }
      retryCount = 0;
      const record = inspectRecovery();
      if (!record) {
        recordRecoveryEvent('recover', 'missing', 'No persisted recovery snapshot is available.');
        emit();
        return null;
      }
      const decision = deriveRecoveryDecision(record, recoveryContentRelation, recoveryRelation);
      if (decision === 'stale' && options.allowStale !== true) {
        recoveryDecision = 'stale';
        recoveryError = 'Persisted CV snapshot is older than the current editor content.';
        updateRecoveryActionState();
        recordRecoveryEvent('recover', 'blocked', recoveryError);
        emit();
        return null;
      }
      if (typeof surface.restorePersistedState !== 'function') {
        throw new Error('Editor surface does not support persisted-state recovery.');
      }
      surface.restorePersistedState(record);
      autosaveStatus = 'idle';
      lastAutosavedAt = record.savedAt || null;
      lastAutosaveError = null;
      applyPersistedMetadata(record, 'same');
      recoveryAction = 'resolved';
      recordRecoveryEvent('recover', 'recovered');
      emit();
      return record;
    },
    clear() {
      if (destroyed) return;
      ++operationToken;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      if (retryTimer) {
        clearTimeout(retryTimer);
        retryTimer = null;
      }
      retryCount = 0;
      adapter.clear?.();
      autosaveStatus = 'idle';
      lastAutosavedAt = null;
      lastAutosaveError = null;
      recoveryStatus = 'missing';
      recoverySavedAt = null;
      recoveryRevision = null;
      recoverySnapshotId = null;
      recoverySnapshotContentId = null;
      recoveryIsNewer = false;
      recoveryRelation = 'missing';
      recoveryContentRelation = 'missing';
      recoveryDecision = 'none';
      recoveryError = null;
      recoveryActionRequired = false;
      recoveryAction = 'none';
      recordRecoveryEvent('clear', 'cleared');
      emit();
    },
    destroy() {
      if (destroyed) return;
      ++operationToken;
      destroyed = true;
      if (timer) clearTimeout(timer);
      if (retryTimer) clearTimeout(retryTimer);
      timer = null;
      retryTimer = null;
      unsubscribe();
      subscribers.clear();
    }
  });
}
