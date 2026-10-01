export const EDITOR_LIFECYCLE_VERSION = '1.6.0';

export function createEditorLifecycleController(surface, recoveryController = null, options = {}) {
  if (!surface || typeof surface.getState !== 'function' || typeof surface.subscribe !== 'function') {
    throw new Error('A valid editor surface is required.');
  }

  let destroyed = false;
  let status = surface.getState().session.dirty ? 'dirty' : 'saved';
  const subscribers = new Set();
  const getAutosaveState = () => recoveryController?.getState?.() || Object.freeze({
    autosaveStatus: 'idle',
    lastAutosavedAt: null,
    lastAutosaveError: null,
    recoveryStatus: 'missing',
    recoveryError: null,
    recoveryActionRequired: false,
    recoveryLastAction: null,
    recoveryAudit: [],
    persistenceRelation: 'missing',
    persistenceSnapshotId: null,
    persistenceSnapshotContentId: null,
    persistenceRevision: null,
    persistenceWriteStatus: 'idle',
    persistenceWriteError: null,
    persistenceWriteRevision: null,
    persistenceWriteSnapshotId: null,
    persistenceWriteSnapshotContentId: null,
    persistenceWriteAt: null,
    recoveryInspectionStatus: 'uninitialized',
    recoveryInspectedAt: null,
    recoveryInspectionSequence: 0,
    recoveryInspectionRetryable: false
  });
  const hasRecovery = () => Boolean(recoveryController?.hasRecovery?.());
  const confirmRecovery = typeof options.confirmRecovery === 'function'
    ? options.confirmRecovery
    : () => false;

  const emit = () => {
    const snapshot = Object.freeze({
      status,
      dirty: Boolean(surface.getState().session.dirty),
      savedAt: surface.getState().session.savedAt || null,
      lastCommand: surface.getState().session.lastCommand || null,
      recoveryAvailable: hasRecovery(),
      ...getAutosaveState()
    });
    subscribers.forEach(listener => listener(snapshot));
    return snapshot;
  };

  const unsubscribeRecovery = recoveryController?.subscribe?.(() => { if (!destroyed) emit(); });

  const unsubscribeSurface = surface.subscribe((state, command) => {
    if (destroyed) return;
    if (command?.type === 'restore') status = 'recovered';
    else if (command?.type === 'save') status = 'saved';
    else if (command?.mutatesData === true || command?.type === 'undo' || command?.type === 'redo') status = 'dirty';
    emit();
  });

  return Object.freeze({
    version: EDITOR_LIFECYCLE_VERSION,
    getState() {
      return Object.freeze({
        status,
        dirty: Boolean(surface.getState().session.dirty),
        savedAt: surface.getState().session.savedAt || null,
        lastCommand: surface.getState().session.lastCommand || null,
        recoveryAvailable: hasRecovery(),
        ...getAutosaveState()
      });
    },
    subscribe(listener) {
      if (typeof listener !== 'function') throw new Error('Lifecycle subscriber must be a function.');
      subscribers.add(listener);
      listener(this.getState());
      return () => subscribers.delete(listener);
    },
    save() {
      if (destroyed) return null;
      if (!recoveryController) {
        if (typeof surface.markSaved !== 'function') throw new Error('Editor surface does not support save lifecycle.');
        const state = surface.markSaved();
        status = 'saved';
        return state;
      }
      try {
        const record = recoveryController.save();
        status = 'saved';
        return record;
      } catch (error) {
        status = surface.getState().session.dirty ? 'dirty' : 'saved';
        emit();
        throw error;
      }
    },
    recover(options = {}) {
      if (destroyed) return null;
      if (!recoveryController) throw new Error('Editor persistence is required for recovery.');
      const state = this.getState();
      if (state.dirty && options.force !== true) {
        const confirmed = typeof options.confirmRecovery === 'function'
          ? options.confirmRecovery(state)
          : confirmRecovery(state);
        if (!confirmed) return null;
      }
      const record = recoveryController.recover({ allowStale: options.force === true || state.recoveryDecision === 'stale' });
      if (record) status = 'recovered';
      return record;
    },
    resolveRecovery(action, options = {}) {
      if (destroyed) return null;
      if (!recoveryController?.resolveRecovery) {
        throw new Error('Editor persistence does not support recovery resolution.');
      }
      if (action === 'recover') {
        const state = this.getState();
        if (state.dirty && options.force !== true) {
          const confirmed = typeof options.confirmRecovery === 'function'
            ? options.confirmRecovery(state)
            : confirmRecovery(state);
          if (!confirmed) return null;
        }
      }
      const result = recoveryController.resolveRecovery(action, {
        allowStale: options.force === true || this.getState().recoveryDecision === 'stale'
      });
      if (result && action === 'recover') status = 'recovered';
      else if (result === true && action === 'dismiss') status = surface.getState().session.dirty ? 'dirty' : 'saved';
      emit();
      return result;
    },
    initializeRecovery() {
      if (destroyed) return null;
      const result = recoveryController?.initialize?.() || null;
      emit();
      return result;
    },
    refreshRecovery() {
      if (destroyed) return null;
      const result = recoveryController?.refreshRecovery?.() || null;
      emit();
      return result;
    },
    getRecoveryAudit() {
      return recoveryController?.getRecoveryAudit?.() || [];
    },
    getPersistenceState() {
      const state = getAutosaveState();
      return Object.freeze({
        persistenceRelation: state.persistenceRelation,
        persistenceSnapshotId: state.persistenceSnapshotId,
        persistenceSnapshotContentId: state.persistenceSnapshotContentId,
        persistenceRevision: state.persistenceRevision,
        persistenceWriteStatus: state.persistenceWriteStatus,
        persistenceWriteError: state.persistenceWriteError,
        persistenceWriteRevision: state.persistenceWriteRevision,
        persistenceWriteSnapshotId: state.persistenceWriteSnapshotId,
        persistenceWriteSnapshotContentId: state.persistenceWriteSnapshotContentId,
        persistenceWriteAt: state.persistenceWriteAt,
        recoveryInspectionStatus: state.recoveryInspectionStatus,
        recoveryInspectionRetryable: state.recoveryInspectionRetryable,
        recoveryInspectedAt: state.recoveryInspectedAt,
        recoveryInspectionSequence: state.recoveryInspectionSequence
      });
    },
    clearRecovery() {
      if (destroyed) return;
      recoveryController?.clear();
      emit();
    },
    flush() {
      if (destroyed) return null;
      return recoveryController?.flush() || null;
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      unsubscribeSurface();
      unsubscribeRecovery?.();
      subscribers.clear();
    }
  });
}
