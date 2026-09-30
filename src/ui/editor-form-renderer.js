export const EDITOR_FORM_RENDERER_VERSION = '1.3.0';

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function attr(value) { return esc(JSON.stringify(value)); }

function orderItems(items, configuredOrder = []) {
  const source = Array.isArray(items) ? [...items] : [];
  const configured = Array.isArray(configuredOrder) ? configuredOrder.map(String) : [];
  const rank = new Map(configured.map((id, index) => [id, index]));
  return source.sort((a, b) => {
    const ar = rank.has(String(a.id)) ? rank.get(String(a.id)) : Number.MAX_SAFE_INTEGER;
    const br = rank.has(String(b.id)) ? rank.get(String(b.id)) : Number.MAX_SAFE_INTEGER;
    if (ar !== br) return ar - br;
    return (Number(a.order) || 0) - (Number(b.order) || 0);
  });
}
function moveOrder(ids, index, delta) {
  const order = [...ids];
  const next = index + delta;
  if (index < 0 || next < 0 || next >= order.length) return order;
  [order[index], order[next]] = [order[next], order[index]];
  return order;
}
function visibilityButton(kind, target, visible) {
  return '<button type="button" data-v2-editor-command="set-visibility" data-v2-target="'+attr({kind,...target})+'" data-v2-payload="'+attr({visible:!visible})+'">'+esc(visible ? 'Hide' : 'Show')+'</button>';
}
function renderField(sectionId, field, index, fieldIds, visible = true) {
  const fieldVisible = visible && field.visibility !== false;
  const up = moveOrder(fieldIds,index,-1);
  const down = moveOrder(fieldIds,index,1);
  const typeOptions = ['text','textarea','email','url','date'].map(type =>
    '<option value="'+type+'"'+(String(field.type||'text')===type?' selected':'')+'>'+type+'</option>'
  ).join('');
  return '<div data-v2-editor-field-wrapper="'+esc(sectionId)+':'+esc(field.id)+'" data-v2-editor-field-hidden="'+String(!visible)+'">' +
    '<div><input data-v2-editor-field-label="'+esc(sectionId)+':'+esc(field.id)+'" value="'+esc(field.label || field.id)+'">' +
    '<select data-v2-editor-field-type="'+esc(sectionId)+':'+esc(field.id)+'">'+typeOptions+'</select></div>' +
    fieldVisible ? '<input data-v2-editor-field="'+esc(sectionId)+':'+esc(field.id)+'" value="'+esc(field.value)+'">' : '<span data-v2-editor-field-hidden-state="true">Hidden in this CV</span>' +
    visibilityButton('field',{sectionId,fieldId:field.id},fieldVisible) +
    '<button type="button" data-v2-editor-command="remove-field" data-v2-target="'+attr({sectionId,fieldId:field.id})+'">Remove</button>' +
    '<button type="button" data-v2-editor-command="reorder" data-v2-target="'+attr({kind:'field',sectionId})+'" data-v2-payload="'+attr({order:up})+'">Move Up</button>' +
    '<button type="button" data-v2-editor-command="reorder" data-v2-target="'+attr({kind:'field',sectionId})+'" data-v2-payload="'+attr({order:down})+'">Move Down</button>' +
    '</div>';
}
function renderEntry(sectionId, entry, index, entryIds, visible = true) {
  const values = entry.values && typeof entry.values === 'object' ? entry.values : {};
  const entryVisible = visible && entry.visibility !== false;
  const up = moveOrder(entryIds,index,-1);
  const down = moveOrder(entryIds,index,1);
  const fields = entryVisible ? Object.keys(values).map(key =>
    '<label data-v2-editor-entry-field-wrapper="'+esc(sectionId)+':'+esc(entry.id)+':'+esc(key)+'">' +
    '<span>'+esc(key)+'</span>' +
    '<input data-v2-editor-entry-field data-v2-entry-key="'+esc(key)+'" data-v2-entry-target="'+attr({sectionId,entryId:entry.id})+'" value="'+esc(values[key])+'">' +
    '</label>'
  ).join('') : '<span data-v2-editor-entry-hidden-state="true">Hidden in this CV</span>';
  return '<article data-v2-editor-entry="'+esc(entry.id)+'" data-v2-editor-entry-hidden="'+String(!entryVisible)+'">' +
    '<h4>'+esc('Entry '+(index+1))+'</h4>'+fields +
    visibilityButton('entry',{sectionId,entryId:entry.id},entryVisible) +
    '<button type="button" data-v2-editor-command="duplicate-entry" data-v2-target="'+attr({sectionId,entryId:entry.id})+'">Duplicate</button>' +
    '<button type="button" data-v2-editor-command="remove-entry" data-v2-target="'+attr({sectionId,entryId:entry.id})+'">Remove</button>' +
    '<button type="button" data-v2-editor-command="reorder" data-v2-target="'+attr({kind:'entry',sectionId})+'" data-v2-payload="'+attr({order:up})+'">Move Up</button>' +
    '<button type="button" data-v2-editor-command="reorder" data-v2-target="'+attr({kind:'entry',sectionId})+'" data-v2-payload="'+attr({order:down})+'">Move Down</button>' +
    '</article>';
}

export function renderEditorForm(surface, documentData, options = {}) {
  if (!surface || !documentData) throw new Error('Editor surface and document data are required.');
  const configuration = options.configuration || surface.getState()?.session?.application?.targetedCV?.configuration || {};
  const hiddenSections = new Set(configuration.hiddenSections || []);
  const hiddenFields = new Set(configuration.hiddenFields || []);
  const hiddenEntries = new Set(configuration.hiddenEntries || []);
  const identity = documentData.careerData?.identity && typeof documentData.careerData.identity === 'object' ? documentData.careerData.identity : {};
  const identityHtml = Object.entries(identity).map(([key,value]) =>
    '<label data-v2-editor-identity-wrapper="'+esc(key)+'"><span>'+esc(key)+'</span><input data-v2-editor-identity-field="'+esc(key)+'" value="'+esc(value)+'"></label>'
  ).join('');
  const sections = orderItems(documentData.careerData?.sections || [], configuration.sectionOrder || []);
  const sectionIds = sections.map(s=>s.id);
  const sectionsHtml = sections.filter(s => s.visibility !== false).map((section, sectionIndex) => {
    const sectionHidden = hiddenSections.has(String(section.id));
    const fields = orderItems(section.fields || [], configuration.fieldOrder?.[section.id] || []);
    const fieldIds = fields.map(f=>f.id);
    const entries = orderItems(section.entries || [], configuration.entryOrder?.[section.id] || []);
    const entryIds = entries.map(e=>e.id);
    const fieldHtml = sectionHidden ? '' : fields.map((field,index) => renderField(section.id,field,index,fieldIds,!hiddenFields.has(String(section.id)+':'+String(field.id)))).join('');
    const entryHtml = sectionHidden ? '' : entries.map((entry,index) => renderEntry(section.id,entry,index,entryIds,!hiddenEntries.has(String(section.id)+':'+String(entry.id)))).join('');
    const sectionUp = moveOrder(sectionIds,sectionIndex,-1);
    const sectionDown = moveOrder(sectionIds,sectionIndex,1);
    return '<section data-v2-editor-section="'+esc(section.id)+'" data-v2-editor-section-hidden="'+String(sectionHidden)+'">' +
      '<header><input data-v2-editor-section-title="'+esc(section.id)+'" value="'+esc(section.title || section.type)+'">' +
      '<span>'+esc(sectionHidden ? 'Hidden in this CV' : 'Visible in this CV')+'</span></header>' +
      visibilityButton('section',{sectionId:section.id},!sectionHidden) +
      '<button type="button" data-v2-editor-command="remove-section" data-v2-target="'+attr({sectionId:section.id})+'">Remove Section</button>' +
      '<button type="button" data-v2-editor-command="reorder" data-v2-target="'+attr({kind:'section'})+'" data-v2-payload="'+attr({order:sectionUp})+'">Move Up</button>' +
      '<button type="button" data-v2-editor-command="reorder" data-v2-target="'+attr({kind:'section'})+'" data-v2-payload="'+attr({order:sectionDown})+'">Move Down</button>' +
      '<div data-v2-editor-fields>'+fieldHtml+'</div>' +
      '<button type="button" data-v2-editor-command="add-field" data-v2-target="'+attr({sectionId:section.id})+'" data-v2-payload="'+attr({type:'text',label:'New Field',value:''})+'">Add Field</button>' +
      '<div data-v2-editor-entries>'+entryHtml+'</div>' +
      (section.repeatable ? '<button type="button" data-v2-editor-command="add-entry" data-v2-target="'+attr({sectionId:section.id})+'" data-v2-payload="'+attr({values:{}})+'">Add '+esc(section.title || section.type || 'entry')+'</button>' : '') +
      '</section>';
  }).join('');
  return Object.freeze({
    version: EDITOR_FORM_RENDERER_VERSION,
    html: '<section data-v2-editor-identity><h3>Personal Information</h3>'+identityHtml+'</section>'+sectionsHtml+
      '<button type="button" data-v2-editor-command="add-section" data-v2-target="'+attr({})+'" data-v2-payload="'+attr({title:'New Section',type:'custom',repeatable:false})+'">Add Section</button>',
    sectionCount:sections.length
  });
}
