import { getSection } from '../core/career-document-core.js';

export const EDITOR_FORM_RENDERER_VERSION = '1.1.0';

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function attr(value) {
  return esc(JSON.stringify(value));
}

function renderField(sectionId, field) {
  return '<label data-v2-editor-field-wrapper="'+esc(sectionId)+':'+esc(field.id)+'">' +
    '<span>'+esc(field.label || field.id)+'</span>' +
    '<input data-v2-editor-field="'+esc(sectionId)+':'+esc(field.id)+'" value="'+esc(field.value)+'">' +
    '</label>';
}

function renderEntry(sectionId, entry, index) {
  const values = entry.values && typeof entry.values === 'object' ? entry.values : {};
  const fields = Object.keys(values).map(key =>
    '<label data-v2-editor-entry-field-wrapper="'+esc(sectionId)+':'+esc(entry.id)+':'+esc(key)+'">' +
    '<span>'+esc(key)+'</span>' +
    '<input data-v2-editor-entry-field data-v2-entry-key="'+esc(key)+'" data-v2-entry-target="'+attr({sectionId,entryId:entry.id})+'" value="'+esc(values[key])+'">' +
    '</label>'
  ).join('');
  return '<article data-v2-editor-entry="'+esc(entry.id)+'">' +
    '<h4>'+esc('Entry '+(index+1))+'</h4>' +
    fields +
    '<button type="button" data-v2-editor-command="remove-entry" data-v2-target="'+attr({sectionId,entryId:entry.id})+'">Remove</button>' +
    '</article>';
}

export function renderEditorForm(surface, documentData, options = {}) {
  if (!surface || !documentData) throw new Error('Editor surface and document data are required.');
  const identity = documentData.careerData?.identity && typeof documentData.careerData.identity === 'object'
    ? documentData.careerData.identity : {};
  const identityHtml = Object.entries(identity).map(([key,value]) =>
    '<label data-v2-editor-identity-wrapper="'+esc(key)+'">' +
    '<span>'+esc(key)+'</span>' +
    '<input data-v2-editor-identity-field="'+esc(key)+'" value="'+esc(value)+'">' +
    '</label>'
  ).join('');

  const sections = Array.isArray(documentData.careerData?.sections) ? documentData.careerData.sections : [];
  const visible = sections.filter(s => s.visibility !== false);
  const html = '<section data-v2-editor-identity><h3>Personal Information</h3>'+identityHtml+'</section>' +
    visible.map(section => {
      const fields = (section.fields || []).filter(f => f.visibility !== false).map(field => renderField(section.id, field)).join('');
      const entries = (section.entries || []).filter(e => e.visibility !== false).map((entry,index) => renderEntry(section.id, entry, index)).join('');
      const addButton = section.repeatable
        ? '<button type="button" data-v2-editor-command="add-entry" data-v2-target="'+attr({sectionId:section.id})+'" data-v2-payload="'+attr({values:{}})+'">Add '+esc(section.title || section.type || 'entry')+'</button>'
        : '';
      return '<section data-v2-editor-section="'+esc(section.id)+'"><h3>'+esc(section.title || section.type)+'</h3>'+fields+entries+addButton+'</section>';
    }).join('');
  return Object.freeze({version:EDITOR_FORM_RENDERER_VERSION,html,sectionCount:visible.length});
}
