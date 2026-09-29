import { getSection } from '../core/career-document-core.js';

export const EDITOR_FORM_RENDERER_VERSION = '1.0.0';

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

export function renderEditorForm(surface, documentData, options = {}) {
  if (!surface || !documentData) throw new Error('Editor surface and document data are required.');
  const sections = Array.isArray(documentData.careerData?.sections) ? documentData.careerData.sections : [];
  const visible = sections.filter(s => s.visibility !== false);
  const html = visible.map(section => {
    const fields = (section.fields || []).filter(f => f.visibility !== false).map(field =>
      '<label data-v2-editor-field-wrapper="'+esc(section.id)+':'+esc(field.id)+'">' +
      '<span>'+esc(field.label || field.id)+'</span>' +
      '<input data-v2-editor-field="'+esc(section.id)+':'+esc(field.id)+'" value="'+esc(field.value)+'">' +
      '</label>'
    ).join('');
    return '<section data-v2-editor-section="'+esc(section.id)+'"><h3>'+esc(section.title || section.type)+'</h3>'+fields+'</section>';
  }).join('');
  return Object.freeze({version:EDITOR_FORM_RENDERER_VERSION,html,sectionCount:visible.length});
}
