export const EDITOR_FORM_RENDERER_VERSION = '1.6.0';

const LABELS = Object.freeze({
  fullName:'Full Name', jobTitle:'Professional Title', email:'Email Address', phone:'Phone Number', location:'Location',
  role:'Role', company:'Company', dates:'Dates', description:'Description', degree:'Degree / Qualification', institution:'Institution'
});
function labelFor(key){ return LABELS[String(key)] || String(key).replace(/([a-z])([A-Z])/g,'$1 $2').replace(/^./,c=>c.toUpperCase()); }
function iconFor(label){ return ({Hide:'👁',Show:'👁',Remove:'🗑',Duplicate:'⧉','Move Up':'↑','Move Down':'↓'})[label] || label; }
function actionButton(label, command, target, payload, extra='') {
  return '<button type="button" class="editor-inline-action '+extra+'" title="'+esc(label)+'" aria-label="'+esc(label)+'" data-v2-editor-command="'+esc(command)+'" data-v2-target="'+attr(target)+'"'+(payload ? ' data-v2-payload="'+attr(payload)+'"' : '')+'>'+esc(iconFor(label))+'</button>';
}

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function attr(value) { return esc(JSON.stringify(value)); }

function hasConfiguredKey(collection, key) {
  return Array.isArray(collection) && collection.some(value => String(value) === String(key));
}

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
  const valueControl = fieldVisible
    ? '<input data-v2-editor-field="'+esc(sectionId)+':'+esc(field.id)+'" value="'+esc(field.value)+'">'
    : '<span data-v2-editor-field-hidden-state="true">Hidden in this CV</span>';
  return '<div data-v2-editor-field-wrapper="'+esc(sectionId)+':'+esc(field.id)+'" data-v2-editor-sortable="field" data-v2-section-id="'+esc(sectionId)+'" data-v2-item-id="'+esc(field.id)+'" data-v2-editor-field-hidden="'+String(!fieldVisible)+'">' +
    '<div class="editor-field-head"><div class="editor-field-definition"><input data-v2-editor-field-label="'+esc(sectionId)+':'+esc(field.id)+'" aria-label="Field label" value="'+esc(field.label || labelFor(field.id))+'">' +
    '<select data-v2-editor-field-type="'+esc(sectionId)+':'+esc(field.id)+'" aria-label="Field type">'+typeOptions+'</select></div><div class="editor-inline-actions">' +
    actionButton('Remove','remove-field',{sectionId,fieldId:field.id}) + actionButton('Move Up','reorder',{kind:'field',sectionId},{order:up}) + actionButton('Move Down','reorder',{kind:'field',sectionId},{order:down}) + '</div></div>' +
    valueControl +

    '</div>';
}
function renderEntry(sectionId, entry, index, entryIds, visible = true) {
  const values = entry.values && typeof entry.values === 'object' ? entry.values : {};
  const entryVisible = visible && entry.visibility !== false;
  const up = moveOrder(entryIds,index,-1);
  const down = moveOrder(entryIds,index,1);
  const fields = entryVisible ? Object.keys(values).map(key =>
    '<label data-v2-editor-entry-field-wrapper="'+esc(sectionId)+':'+esc(entry.id)+':'+esc(key)+'">' +
    '<span>'+esc(labelFor(key))+'</span>' +
    '<input data-v2-editor-entry-field data-v2-entry-key="'+esc(key)+'" data-v2-entry-target="'+attr({sectionId,entryId:entry.id})+'" value="'+esc(values[key])+'">' +
    '</label>'
  ).join('') : '<span data-v2-editor-entry-hidden-state="true">Hidden in this CV</span>';
  return '<article data-v2-editor-entry="'+esc(entry.id)+'" data-v2-editor-sortable="entry" data-v2-section-id="'+esc(sectionId)+'" data-v2-item-id="'+esc(entry.id)+'" data-v2-editor-entry-hidden="'+String(!entryVisible)+'">' +
    '<div class="editor-entry-head"><h4>'+esc('Entry '+(index+1))+'</h4><div class="editor-inline-actions">' +
    actionButton(entryVisible ? 'Hide' : 'Show','set-visibility',{kind:'entry',sectionId,entryId:entry.id},{visible:!entryVisible}) +
    actionButton('Duplicate','duplicate-entry',{sectionId,entryId:entry.id}) + actionButton('Remove','remove-entry',{sectionId,entryId:entry.id}) +
    actionButton('Move Up','reorder',{kind:'entry',sectionId},{order:up}) + actionButton('Move Down','reorder',{kind:'entry',sectionId},{order:down}) + '</div></div>'+fields +
    '</article>';
}

export function renderEditorForm(surface, documentData, options = {}) {
  if (!surface || !documentData) throw new Error('Editor surface and document data are required.');
  const liveConfiguration = surface.getState()?.session?.application?.targetedCV?.configuration;
  const configuration = options.configuration || liveConfiguration || {};
  const hiddenSections = Array.isArray(configuration.hiddenSections) ? configuration.hiddenSections.map(String) : [];
  const hiddenFields = Array.isArray(configuration.hiddenFields) ? configuration.hiddenFields.map(String) : [];
  const hiddenEntries = Array.isArray(configuration.hiddenEntries) ? configuration.hiddenEntries.map(String) : [];
  const identity = documentData.careerData?.identity && typeof documentData.careerData.identity === 'object' ? documentData.careerData.identity : {};
  const identityHtml = Object.entries(identity).map(([key,value]) =>
    '<label data-v2-editor-identity-wrapper="'+esc(key)+'"><span>'+esc(labelFor(key))+'</span><input data-v2-editor-identity-field="'+esc(key)+'" aria-label="'+esc(labelFor(key))+'" value="'+esc(value)+'"></label>'
  ).join('');
  const sections = orderItems(documentData.careerData?.sections || [], configuration.sectionOrder || []);
  const sectionIds = sections.map(s=>s.id);
  const sectionsHtml = sections.filter(s => s.visibility !== false).map((section, sectionIndex) => {
    const sectionHidden = hasConfiguredKey(hiddenSections, section.id);
    const fields = orderItems(section.fields || [], configuration.fieldOrder?.[section.id] || []);
    const fieldIds = fields.map(f=>f.id);
    const entries = orderItems(section.entries || [], configuration.entryOrder?.[section.id] || []);
    const entryIds = entries.map(e=>e.id);
    const fieldHtml = sectionHidden ? '' : fields.map((field,index) => renderField(section.id,field,index,fieldIds,!hasConfiguredKey(hiddenFields, String(section.id)+':'+String(field.id)))).join('');
    const entryHtml = sectionHidden ? '' : entries.map((entry,index) => renderEntry(section.id,entry,index,entryIds,!hasConfiguredKey(hiddenEntries, String(section.id)+':'+String(entry.id)))).join('');
    const sectionUp = moveOrder(sectionIds,sectionIndex,-1);
    const sectionDown = moveOrder(sectionIds,sectionIndex,1);
    return '<section data-v2-editor-section="'+esc(section.id)+'" data-v2-editor-sortable="section" data-v2-item-id="'+esc(section.id)+'" data-v2-editor-section-hidden="'+String(sectionHidden)+'">' +
      '<header class="editor-section-head"><div class="editor-section-title"><input data-v2-editor-section-title="'+esc(section.id)+'" aria-label="Section title" value="'+esc(section.title || labelFor(section.type))+'"><span>'+esc(sectionHidden ? 'Hidden in this CV' : 'Visible in this CV')+'</span></div>' +
      '<div class="editor-inline-actions">' + actionButton(sectionHidden ? 'Show' : 'Hide','set-visibility',{kind:'section',sectionId:section.id},{visible:!sectionHidden}) + actionButton('Remove','remove-section',{sectionId:section.id}) + actionButton('Move Up','reorder',{kind:'section'},{order:sectionUp}) + actionButton('Move Down','reorder',{kind:'section'},{order:sectionDown}) + '</div></header>' +
      '<div data-v2-editor-fields>'+fieldHtml+'</div>' +
      '<button type="button" data-v2-editor-command="add-field" data-v2-target="'+attr({sectionId:section.id})+'" data-v2-payload="'+attr({type:'text',label:'New Field',value:''})+'">Add Field</button>' +
      '<div data-v2-editor-entries>'+entryHtml+'</div>' +
      (section.repeatable ? '<button type="button" data-v2-editor-command="add-entry" data-v2-target="'+attr({sectionId:section.id})+'" data-v2-payload="'+attr({values:{}})+'">Add '+esc(section.title || section.type || 'entry')+'</button>' : '') +
      '</section>';
  }).join('');
  const assets = Array.isArray(documentData.careerData?.assets) ? documentData.careerData.assets : [];
  const photo = assets.find(item => String(item?.key || item?.id || '') === 'profile-photo');
  const photoHtml = '<section class="editor-photo-card" data-v2-editor-photo>' +
    '<div class="editor-photo-head"><div><strong>Profile Photo</strong><span>Optional • used by templates that support photos</span></div></div>' +
    '<div class="editor-photo-body">' + (photo?.url || photo?.src ? '<img class="editor-photo-preview" src="'+esc(photo.url || photo.src)+'" alt="Profile photo preview">' : '<div class="editor-photo-placeholder">No photo added</div>') +
    '<div class="editor-photo-actions"><label class="editor-photo-upload">'+(photo?.url || photo?.src ? 'Change Photo' : 'Upload Photo')+'<input type="file" accept="image/*" data-v2-editor-photo-input hidden></label>' +
    ((photo?.url || photo?.src) ? '<button type="button" class="editor-photo-remove" data-v2-editor-photo-remove="profile-photo">Remove Photo</button>' : '') + '</div></div></section>';
  return Object.freeze({
    version: EDITOR_FORM_RENDERER_VERSION,
    html: photoHtml+'<section data-v2-editor-identity><h3>Personal Information</h3>'+identityHtml+'</section>'+sectionsHtml+
      '<button type="button" data-v2-editor-command="add-section" data-v2-target="'+attr({})+'" data-v2-payload="'+attr({title:'New Section',type:'custom',repeatable:false})+'">Add Section</button>',
    sectionCount:sections.length
  });
}
