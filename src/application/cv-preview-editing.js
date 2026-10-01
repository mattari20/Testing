import { setFieldDefinition, setSectionTitle, setEntryValues } from '../core/career-document-core.js';

export const CV_PREVIEW_EDITING_VERSION = '1.0.0';
const clone = value => value == null ? value : JSON.parse(JSON.stringify(value));

function parseTarget(blockId) {
  const value = String(blockId || '');
  const parts = value.split(':');
  if (parts[0] === 'section' && parts[1]) return { kind:'section', sectionId:parts[1] };
  if (parts[0] === 'field' && parts[1] && parts[2]) return { kind:'field', sectionId:parts[1], fieldId:parts[2] };
  if (parts[0] === 'entry' && parts[1] && parts[2]) return { kind:'entry', sectionId:parts[1], entryId:parts[2] };
  return { kind:'unknown', blockId:value };
}

export function resolvePreviewEditTarget(blockId) {
  return Object.freeze(parseTarget(blockId));
}

export function createPreviewEditSession() {
  let sequence = 0;
  let destroyed = false;
  const edits = [];
  return Object.freeze({
    version: CV_PREVIEW_EDITING_VERSION,
    resolve(blockId) { return destroyed ? null : resolvePreviewEditTarget(blockId); },
    apply(profile, blockId, patch = {}) {
      if (destroyed) return null;
      const target = parseTarget(blockId);
      if (target.kind === 'section') {
        setSectionTitle(profile, target.sectionId, patch.title);
      } else if (target.kind === 'field') {
        setFieldDefinition(profile, target.sectionId, target.fieldId, patch);
      } else if (target.kind === 'entry') {
        if (!patch.values || typeof patch.values !== 'object' || Array.isArray(patch.values)) throw new Error('Entry preview edits require a values object.');
        setEntryValues(profile, target.sectionId, target.entryId, patch.values);
      } else {
        throw new Error('Preview block is not editable: ' + blockId);
      }
      const record = { sequence: ++sequence, blockId:String(blockId), target, patch:clone(patch) };
      edits.push(record);
      if (edits.length > 100) edits.shift();
      return Object.freeze(clone(record));
    },
    getHistory() { return Object.freeze(clone(edits)); },
    destroy() { destroyed = true; edits.length = 0; }
  });
}
