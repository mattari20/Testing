export const EDITOR_LIFECYCLE_VERSION = '1.0.0';

export function createEditorLifecycleController(surface, recoveryController = null) {
  if (!surface || typeof surface.getState !== 'function' || typeof surface.subscribe !== 'function') {
    throw new Error('A valid editor surface is required.');
  }

  let destroyed = false;
  let status = surface.getState().session.dirty ? 'dirty' : 'saved';
  const subscribers = new Set();

  const emit = () => {
    const snapshot = Object.freeze({
      status,
      dirty: Boolean(surface.getState().session.dirty),
      savedAt: surface.getState().session.savedAt || null,
      lastCommand: surface.getState().session.lastCommand || null
    });
    subscribers.forEach(listener => listener(snapshot));
    return snapshot;
  };

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
        lastCommand: surface.getState().session.lastCommand || null
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
      const record = recoveryController.save();
      status = 'saved';
      return record;
    },
    recover() {
      if (destroyed) return null;
      if (!recoveryController) throw new Error('Editor persistence is required for recovery.');
      const record = recoveryController.recover();
      if (record) status = 'recovered';
      return record;
    },
    clearRecovery() {
      if (destroyed) return;
      recoveryController?.clear();
    },
    flush() {
      if (destroyed) return null;
      return recoveryController?.flush() || null;
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      unsubscribeSurface();
      subscribers.clear();
    }
  });
}
