export const EDITOR_SESSION_GUARD_VERSION = '1.0.0';

export function createEditorSessionGuard(lifecycle, target = null, options = {}) {
  if (!lifecycle || typeof lifecycle.getState !== 'function' || typeof lifecycle.subscribe !== 'function') {
    throw new Error('A valid editor lifecycle controller is required.');
  }

  const eventTarget = target || (typeof window !== 'undefined' ? window : null);
  const message = String(options.message || 'You have unsaved CV changes.');
  let dirty = Boolean(lifecycle.getState().dirty);
  let destroyed = false;

  const unsubscribe = lifecycle.subscribe(state => {
    dirty = Boolean(state.dirty);
  });

  const beforeUnload = event => {
    if (destroyed || !dirty) return undefined;
    event?.preventDefault?.();
    if (event) event.returnValue = message;
    return message;
  };

  eventTarget?.addEventListener?.('beforeunload', beforeUnload);

  return Object.freeze({
    version: EDITOR_SESSION_GUARD_VERSION,
    hasUnsavedChanges: () => dirty,
    canLeave: () => !dirty,
    requestLeave(confirmLeave) {
      if (!dirty) return true;
      if (typeof confirmLeave !== 'function') return false;
      return Boolean(confirmLeave(message));
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      eventTarget?.removeEventListener?.('beforeunload', beforeUnload);
      unsubscribe();
    }
  });
}
