export const EDITOR_FORM_RENDERER_VERSION = '1.9.0';

const LABELS = Object.freeze({
  fullName:'Full Name', jobTitle:'Professional Title', email:'Email Address', phone:'Phone Number', location:'Location',
  role:'Role', company:'Company', dates:'Dates', startDate:'Start Date', endDate:'End Date', description:'Description',
  degree:'Degree / Qualification', institution:'Institution', grade:'Grade'
});

const CORE_SECTIONS = new Set(['summary','experience','education','skills','languages','projects','achievements','contact','photo']);
const PALETTE = Object.freeze([
  {id:'navy',name:'Navy',primary:'#30364F',dark:'#151927',light:'#D7DAE3',contrast:'#FFFFFF'},
  {id:'blue',name:'Blue',primary:'#2563EB',dark:'#173B8F',light:'#DBE7FF',contrast:'#FFFFFF'},
  {id:'teal',name:'Teal',primary:'#0F766E',dark:'#0B4F4A',light:'#D7F0ED',contrast:'#FFFFFF'},
  {id:'green',name:'Green',primary:'#166534',dark:'#0B3D1F',light:'#DCEFE2',contrast:'#FFFFFF'},
  {id:'burgundy',name:'Burgundy',primary:'#8B1E3F',dark:'#4D1025',light:'#F0DCE4',contrast:'#FFFFFF'},
  {id:'charcoal',name:'Charcoal',primary:'#374151',dark:'#1F2937',light:'#E5E7EB',contrast:'#FFFFFF'},
  {id:'purple',name:'Purple',primary:'#6D28D9',dark:'#3B167D',light:'#E9DEFF',contrast:'#FFFFFF'},
  {id:'orange',name:'Orange',primary:'#C2410C',dark:'#7C2D12',light:'#FCE2D4',contrast:'#FFFFFF'}
]);

function esc(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function attr(value){return esc(JSON.stringify(value));}
function labelFor(key){return LABELS[String(key)]||String(key).replace(/([a-z])([A-Z])/g,'$1 $2').replace(/^./,c=>c.toUpperCase());}
function parseColorId(config){return String(config?.presentation?.themeColor||'navy');}
function paletteById(id){return PALETTE.find(item=>item.id===id)||PALETTE[0];}
function hasConfiguredKey(collection,key){return Array.isArray(collection)&&collection.some(value=>String(value)===String(key));}
function orderItems(items,configuredOrder=[]){
  const source=Array.isArray(items)?[...items]:[];
  const configured=Array.isArray(configuredOrder)?configuredOrder.map(String):[];
  const rank=new Map(configured.map((id,index)=>[id,index]));
  return source.sort((a,b)=>{
    const ar=rank.has(String(a.id))?rank.get(String(a.id)):Number.MAX_SAFE_INTEGER;
    const br=rank.has(String(b.id))?rank.get(String(b.id)):Number.MAX_SAFE_INTEGER;
    if(ar!==br)return ar-br;
    return (Number(a.order)||0)-(Number(b.order)||0);
  });
}
function moveOrder(ids,index,delta){
  const order=[...ids],next=index+delta;
  if(index<0||next<0||next>=order.length)return order;
  [order[index],order[next]]=[order[next],order[index]]; return order;
}
function icon(label){return ({Hide:'◉',Show:'◉',Duplicate:'⧉',Remove:'×','Move Up':'↑','Move Down':'↓','Edit Crop':'✥'})[label]||label;}
function actionButton(label,command,target,payload,extra=''){
  return '<button type="button" class="editor-inline-action '+extra+'" title="'+esc(label)+'" aria-label="'+esc(label)+'" data-v2-editor-command="'+esc(command)+'" data-v2-target="'+attr(target)+'"'+(payload?' data-v2-payload="'+attr(payload)+'"':'')+'>'+esc(icon(label))+'</button>';
}
function visibilityButton(kind,target,visible){
  return actionButton(visible?'Hide':'Show','set-visibility',{kind,...target},{visible:!visible});
}

function renderField(sectionId,field,index,fieldIds,visible=true){
  const fieldVisible=visible&&field.visibility!==false;
  const up=moveOrder(fieldIds,index,-1),down=moveOrder(fieldIds,index,1);
  const typeOptions=['text','textarea','email','url','date'].map(type=>'<option value="'+type+'"'+(String(field.type||'text')===type?' selected':'')+'>'+type+'</option>').join('');
  const valueControl=fieldVisible
    ? '<input data-v2-editor-field="'+esc(sectionId)+':'+esc(field.id)+'" value="'+esc(field.value)+'">'
    : '<div class="editor-hidden-note">This field is hidden from the CV.</div>';
  return '<div class="editor-field-card" data-v2-editor-field-wrapper="'+esc(sectionId)+':'+esc(field.id)+'" data-v2-editor-sortable="field" data-v2-section-id="'+esc(sectionId)+'" data-v2-item-id="'+esc(field.id)+'" data-v2-editor-field-hidden="'+String(!fieldVisible)+'">'+
    '<div class="editor-field-head"><div class="editor-field-definition"><input data-v2-editor-field-label="'+esc(sectionId)+':'+esc(field.id)+'" aria-label="Field label" value="'+esc(field.label||labelFor(field.id))+'"><select data-v2-editor-field-type="'+esc(sectionId)+':'+esc(field.id)+'" aria-label="Field type">'+typeOptions+'</select></div>'+
    '<div class="editor-inline-actions">'+actionButton('Remove','remove-field',{sectionId,fieldId:field.id})+actionButton('Move Up','reorder',{kind:'field',sectionId},{order:up})+actionButton('Move Down','reorder',{kind:'field',sectionId},{order:down})+'</div></div>'+valueControl+'</div>';
}

function renderEntry(sectionId,entry,index,entryIds,visible=true){
  const values=entry.values&&typeof entry.values==='object'?entry.values:{};
  const entryVisible=visible&&entry.visibility!==false;
  const up=moveOrder(entryIds,index,-1),down=moveOrder(entryIds,index,1);
  const isExperience=String(sectionId).toLowerCase()==='experience';
  const isEducation=String(sectionId).toLowerCase()==='education';
  const entryKeys=isExperience?['role','company','startDate','endDate','description']:isEducation?['degree','institution','dates']:Object.keys(values);
  const fields=entryVisible?entryKeys.map(key=>{
    const value=values[key]==null?'':values[key];
    const inputType=isExperience&&(key==='startDate'||key==='endDate')?'month':'text';
    const extra=isExperience&&(key==='startDate'||key==='endDate')?' min="1900-01" max="2100-12"':'';
    const legacyHint=isExperience&&key==='startDate'&&!value&&values.dates?'<small class="editor-field-help">Legacy duration: '+esc(values.dates)+'. Enter Start/End month and year to replace it.</small>':'';
    return '<label class="editor-entry-field"><span>'+esc(labelFor(key))+'</span><input type="'+inputType+'"'+extra+' data-v2-editor-entry-field data-v2-entry-key="'+esc(key)+'" data-v2-entry-target="'+attr({sectionId,entryId:entry.id})+'" value="'+esc(value)+'">'+legacyHint+'</label>';
  }).join(''):'<div class="editor-hidden-note">This entry is hidden from the CV.</div>';
  return '<article class="editor-entry-card" data-v2-editor-entry="'+esc(entry.id)+'" data-v2-editor-sortable="entry" data-v2-section-id="'+esc(sectionId)+'" data-v2-item-id="'+esc(entry.id)+'" data-v2-editor-entry-hidden="'+String(!entryVisible)+'">'+
    '<div class="editor-entry-head"><div><span class="editor-entry-kicker">ENTRY '+(index+1)+'</span><strong>'+esc(isExperience?'Work Experience':isEducation?'Education':'Entry')+'</strong></div><div class="editor-inline-actions">'+visibilityButton('entry',{sectionId,entryId:entry.id},entryVisible)+actionButton('Duplicate','duplicate-entry',{sectionId,entryId:entry.id})+actionButton('Remove','remove-entry',{sectionId,entryId:entry.id})+actionButton('Move Up','reorder',{kind:'entry',sectionId},{order:up})+actionButton('Move Down','reorder',{kind:'entry',sectionId},{order:down})+'</div></div>'+
    '<div class="editor-entry-fields">'+fields+'</div></article>';
}

function renderPalette(configuration){
  const selected=parseColorId(configuration);
  return '<section class="editor-design-card"><div class="editor-panel-title"><div><span class="editor-eyebrow">DESIGN</span><h3>CV Color</h3></div><span class="editor-panel-help">Choose a professional accent color</span></div>'+
    '<div class="editor-palette" role="radiogroup" aria-label="CV color palette">'+PALETTE.map(color=>{
      const active=color.id===selected;
      return '<button type="button" class="editor-color-swatch'+(active?' active':'')+'" title="'+esc(color.name)+'" aria-label="'+esc(color.name)+'" aria-checked="'+String(active)+'" role="radio" data-v2-editor-command="set-theme-color" data-v2-target="{}" data-v2-payload="'+attr({themeColor:color.id})+'"><span style="background:'+color.primary+'"></span></button>';
    }).join('')+'</div></section>';
}

function renderListField(sectionId,field,index,fieldIds,visible,itemLabel){
  const fieldVisible=visible&&field.visibility!==false;
  const up=moveOrder(fieldIds,index,-1),down=moveOrder(fieldIds,index,1);
  const value=field.value==null?'':String(field.value);
  const placeholder=sectionId==='skills'?'JavaScript, HTML, CSS, Git, Testing':'English, Urdu, Punjabi';
  const hint=sectionId==='skills'
    ? 'Write each skill separated by a comma. Example: JavaScript, HTML, CSS, Git.'
    : 'Write each language separated by a comma. Example: English, Urdu, Punjabi.';
  return '<div class="editor-list-field-card" data-v2-editor-field-wrapper="'+esc(sectionId+':'+field.id)+'" data-v2-editor-field-hidden="'+String(!fieldVisible)+'">'+
    '<div class="editor-list-field-head"><div><span class="editor-entry-kicker">'+esc(itemLabel)+' '+(index+1)+'</span><strong>'+esc(sectionId==='skills'?'Skill list':'Language list')+'</strong></div>'+
    '<div class="editor-inline-actions">'+actionButton('Remove','remove-field',{sectionId,fieldId:field.id})+actionButton('Move Up','reorder',{kind:'field',sectionId},{order:up})+actionButton('Move Down','reorder',{kind:'field',sectionId},{order:down})+'</div></div>'+
    (fieldVisible
      ? '<label class="editor-list-field-label"><span>'+esc(itemLabel)+' content</span><input data-v2-editor-field="'+esc(sectionId)+':'+esc(field.id)+'" value="'+esc(value)+'" placeholder="'+esc(placeholder)+'"><small class="editor-field-help">'+esc(hint)+'</small></label>'
      : '<div class="editor-hidden-note">This '+esc(itemLabel.toLowerCase())+' is hidden from the CV.</div>')+
    '</div>';
}

function renderPhotoCard(documentData,photoShape='circle'){
  const assets=Array.isArray(documentData.careerData?.assets)?documentData.careerData.assets:[];
  const photo=assets.find(item=>String(item?.key||item?.id||'')==='profile-photo');
  const hasPhoto=Boolean(photo?.url||photo?.src);
  const shape=String(photoShape||'circle');
  const radius=shape==='circle'?'50%':shape==='square'?'8px':'14px';
  return '<section class="editor-photo-card" data-v2-editor-photo>'+
    '<div class="editor-panel-title"><div><span class="editor-eyebrow">PHOTO</span><h3>Profile Photo</h3></div><span class="editor-panel-help">Editor matches the selected CV template shape</span></div>'+
    '<div class="editor-photo-layout"><div class="editor-photo-frame '+esc(shape)+'" style="border-radius:'+radius+'">'+(hasPhoto?'<img class="editor-photo-preview" src="'+esc(photo.url||photo.src)+'" alt="Profile photo preview">':'<div class="editor-photo-placeholder">No photo</div>')+'</div>'+
    '<div class="editor-photo-copy"><strong>'+(hasPhoto?'Photo ready':'Add a profile photo')+'</strong><p>'+(hasPhoto?'Crop and position the image without changing the template shape.':'Upload JPG, PNG or WebP up to 2 MB.')+'</p><div class="editor-photo-actions"><label class="editor-photo-upload">'+(hasPhoto?'Change Photo':'Upload Photo')+'<input type="file" accept="image/*" data-v2-editor-photo-input hidden></label>'+(hasPhoto?'<button type="button" class="editor-photo-crop" data-v2-editor-photo-crop="profile-photo">Adjust Crop</button>':'')+(hasPhoto?'<button type="button" class="editor-photo-remove" data-v2-editor-photo-remove="profile-photo">Remove</button>':'')+'</div></div></div></section>';
}

export function renderEditorForm(surface,documentData,options={}){
  if(!surface||!documentData)throw new Error('Editor surface and document data are required.');
  const configuration=options.configuration||surface.getState()?.session?.application?.targetedCV?.configuration||{};
  const hiddenSections=Array.isArray(configuration.hiddenSections)?configuration.hiddenSections.map(String):[];
  const hiddenFields=Array.isArray(configuration.hiddenFields)?configuration.hiddenFields.map(String):[];
  const hiddenEntries=Array.isArray(configuration.hiddenEntries)?configuration.hiddenEntries.map(String):[];
  const identity=documentData.careerData?.identity&&typeof documentData.careerData.identity==='object'?documentData.careerData.identity:{};
  const identityHtml=Object.entries(identity).map(([key,value])=>'<label class="editor-identity-field"><span>'+esc(labelFor(key))+'</span><input data-v2-editor-identity-field="'+esc(key)+'" aria-label="'+esc(labelFor(key))+'" value="'+esc(value)+'"></label>').join('');
  const sections=orderItems(documentData.careerData?.sections||[],configuration.sectionOrder||[]);
  const sectionIds=sections.map(s=>s.id);

  const sectionsHtml=sections.filter(section=>section.visibility!==false).map((section,sectionIndex)=>{
    const sid=String(section.id),type=String(section.type||'custom').toLowerCase(),isCore=CORE_SECTIONS.has(type),sectionHidden=hasConfiguredKey(hiddenSections,sid)||hasConfiguredKey(hiddenSections,type);
    const fields=orderItems(section.fields||[],configuration.fieldOrder?.[sid]||[]);
    const fieldIds=fields.map(f=>f.id);
    const entries=orderItems(section.entries||[],configuration.entryOrder?.[sid]||[]);
    const entryIds=entries.map(e=>e.id);
    const sectionUp=moveOrder(sectionIds,sectionIndex,-1),sectionDown=moveOrder(sectionIds,sectionIndex,1);
    const fieldHtml=!sectionHidden&&type!=='experience'&&type!=='education'
      ? (type==='skills'||type==='languages'
        ? fields.map((field,index)=>renderListField(sid,field,index,fieldIds,!hasConfiguredKey(hiddenFields,sid+':'+field.id),type==='skills'?'Skill':'Language')).join('')
        : fields.map((field,index)=>renderField(sid,field,index,fieldIds,!hasConfiguredKey(hiddenFields,sid+':'+field.id))).join(''))
      : '';
    const entryHtml=!sectionHidden?entries.map((entry,index)=>renderEntry(sid,entry,index,entryIds,!hasConfiguredKey(hiddenEntries,sid+':'+entry.id))).join(''):'';
    const addButton=type==='experience'?'Add Experience':type==='education'?'Add Education':('Add '+(section.title||labelFor(type)));
    const canAddEntry=section.repeatable;
    const canAddField=!section.repeatable&&type!=='photo';
    return '<section class="editor-section-card'+(sectionHidden?' is-hidden':'')+'" data-v2-editor-section="'+esc(sid)+'" data-v2-editor-sortable="section" data-v2-item-id="'+esc(sid)+'" data-v2-editor-section-hidden="'+String(sectionHidden)+'">'+
      '<div class="editor-section-banner"><div class="editor-section-title-wrap"><span class="editor-section-icon">'+esc(type==='experience'?'WORK':type==='education'?'EDU':type==='skills'?'SKILLS':type==='languages'?'LANG':type==='summary'?'SUMMARY':'SECTION')+'</span><div><h3>'+esc(section.title||labelFor(type))+'</h3><span class="editor-section-status">'+(sectionHidden?'Hidden from CV':'Visible in CV')+'</span></div></div>'+
      '<div class="editor-section-actions">'+visibilityButton('section',{sectionId:sid},!sectionHidden)+(isCore?'':actionButton('Remove','remove-section',{sectionId:sid}))+actionButton('Move Up','reorder',{kind:'section'},{order:sectionUp})+actionButton('Move Down','reorder',{kind:'section'},{order:sectionDown})+'</div></div>'+
      (isCore?'':'<div class="editor-custom-title"><label>Section name<input data-v2-editor-section-title="'+esc(sid)+'" value="'+esc(section.title||'New Section')+'"></label></div>')+
      (!sectionHidden?'<div class="editor-section-content">'+fieldHtml+entryHtml+(canAddEntry?'<button type="button" class="editor-add-entry" data-v2-editor-command="add-entry" data-v2-target="'+attr({sectionId:sid})+'" data-v2-payload="'+attr({values:{}})+'">+ '+esc(addButton)+'</button>':'')+(canAddField?'<button type="button" class="editor-add-field" data-v2-editor-command="add-field" data-v2-target="'+attr({sectionId:sid})+'" data-v2-payload="'+attr({type:'text',label:type==='skills'?'Skill':type==='languages'?'Language':'New Field',value:''})+'">+ '+esc(type==='skills'?'Add Skill':type==='languages'?'Add Language':'Add Field')+'</button>':'')+'</div>':'<div class="editor-hidden-section-note">This section is hidden. Use the eye button to show it again.</div>')+
      '</section>';
  }).join('');

  return Object.freeze({
    version:EDITOR_FORM_RENDERER_VERSION,
    html:renderPalette(configuration)+renderPhotoCard(documentData,options.photoShape||'circle')+
      '<section class="editor-section-card editor-identity-card"><div class="editor-section-banner"><div class="editor-section-title-wrap"><span class="editor-section-icon">INFO</span><div><h3>Personal Information</h3><span class="editor-section-status">Your contact details</span></div></div></div><div class="editor-section-content editor-identity-grid">'+identityHtml+'</div></section>'+
      sectionsHtml+
      '<button type="button" class="editor-add-section" data-v2-editor-command="add-section" data-v2-editor-target="{}" data-v2-target="'+attr({})+'" data-v2-payload="'+attr({title:'New Section',type:'custom',repeatable:false})+'">+ Add Custom Section</button>',
    sectionCount:sections.length
  });
}
