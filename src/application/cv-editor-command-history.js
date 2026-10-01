export const CV_EDITOR_COMMAND_HISTORY_VERSION = '1.0.0';
const clone = value => value == null ? value : JSON.parse(JSON.stringify(value));

export function createEditorCommandHistory(options = {}) {
  const getSnapshot = options.getSnapshot;
  const restoreSnapshot = options.restoreSnapshot;
  if (typeof getSnapshot !== 'function' || typeof restoreSnapshot !== 'function') throw new Error('Command history requires getSnapshot and restoreSnapshot.');
  const maxHistory = Math.max(1, Number(options.maxHistory) || 100);
  let past = [];
  let future = [];
  let destroyed = false;
  let sequence = 0;

  const state = () => Object.freeze({
    version: CV_EDITOR_COMMAND_HISTORY_VERSION,
    pastCount: past.length,
    futureCount: future.length,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    sequence
  });

  function execute(command) {
    if (destroyed) return null;
    if (!command || typeof command.do !== 'function') throw new Error('Command do() is required.');
    const before = clone(getSnapshot());
    command.do();
    const after = clone(getSnapshot());
    const record = { id:'cmd_' + (++sequence), label:String(command.label || 'Edit'), before, after };
    past.push(record);
    if (past.length > maxHistory) past.shift();
    future = [];
    return state();
  }

  function undo() {
    if (destroyed || !past.length) return state();
    const record = past.pop();
    restoreSnapshot(clone(record.before));
    future.push(record);
    return state();
  }

  function redo() {
    if (destroyed || !future.length) return state();
    const record = future.pop();
    restoreSnapshot(clone(record.after));
    past.push(record);
    return state();
  }

  return Object.freeze({
    version: CV_EDITOR_COMMAND_HISTORY_VERSION,
    getState: state,
    execute,
    undo,
    redo,
    clear() { past = []; future = []; return state(); },
    getHistory() { return Object.freeze(clone(past)); },
    destroy() { destroyed = true; past = []; future = []; }
  });
}
