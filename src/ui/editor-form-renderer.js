export const EDITOR_FORM_RENDERER_VERSION = '1.22.0';

const LABELS = Object.freeze({
  fullName:'Full Name', jobTitle:'Professional Title', email:'Email Address', phone:'Phone Number', location:'Location',
  role:'Role', company:'Company', dates:'Dates', startDate:'Start Date', endDate:'End Date', description:'Description', dateOfBirth:'Date of Birth',
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
function icon(label){
  const icons={
    Hide:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.2 12s3.6-6 9.8-6 9.8 6 9.8 6-3.6 6-9.8 6-9.8-6-9.8-6Z"/><circle cx="12" cy="12" r="2.8"/></svg>',
    Show:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18M10.6 6.3A10.8 10.8 0 0 1 12 6c6.2 0 9.8 6 9.8 6a17.8 17.8 0 0 1-3.1 3.6M6.2 6.8C3.8 8.5 2.2 12 2.2 12s3.6 6 9.8 6c1.5 0 2.8-.3 4-.8"/><path d="M9.8 9.8a3.1 3.1 0 0 0 4.4 4.4"/></svg>',
    Duplicate:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg>',
    Remove:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="m9 9 6 6M15 9l-6 6"/></svg>',
    'Move Up':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6.5 10.5 12 5l5.5 5.5"/></svg>',
    'Move Down':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M6.5 13.5 12 19l5.5-5.5"/></svg>',
    'Edit Crop':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3v4H3M17 3v4h4M7 21v-4H3M17 21v-4h4M7 7h10v10H7z"/></svg>'
  };
  return icons[label]||label;
}
function actionButton(label,command,target,payload,extra=''){
  return '<button type="button" class="editor-inline-action '+extra+' action-'+label.toLowerCase().replace(/\\s+/g,'-')+'" title="'+esc(label)+'" aria-label="'+esc(label)+'" data-v2-editor-command="'+esc(command)+'" data-v2-target="'+attr(target)+'"'+(payload?' data-v2-payload="'+attr(payload)+'"':'')+'>'+icon(label)+'</button>';
}
function visibilityButton(kind,target,visible){
  return actionButton(visible?'Hide':'Show','set-visibility',{kind,...target},{visible:!visible});
}
function identityRemoveButton(key){
  return actionButton('Remove','remove-identity-field',{key});
}
function identityFieldActions(key,visible,removable){
  return '<div class="editor-identity-actions">'+visibilityButton('identity',{key},visible)+(removable?identityRemoveButton(key):'')+'</div>';
}
function formatLongDate(value){
  const raw=String(value||'').trim();
  if(!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  const [year,month,day]=raw.split('-').map(Number);
  if(!year||!month||!day)return raw;
  const date=new Date(Date.UTC(year,month-1,day));
  if(Number.isNaN(date.getTime()))return raw;
  const ordinal=(n)=>{const mod100=n%100; if(mod100>=11&&mod100<=13)return n+'th'; switch(n%10){case 1:return n+'st';case 2:return n+'nd';case 3:return n+'rd';default:return n+'th';}};
  return ordinal(day)+' '+new Intl.DateTimeFormat('en-US',{month:'long',timeZone:'UTC'}).format(date)+', '+year;
}
function renderIdentityDateField(key,value,identityVisible,removable){
  const raw=String(value||'');
  const formatted=formatLongDate(raw);
  return '<div class="editor-identity-field-control"><div class="editor-identity-date-wrap"><input class="editor-identity-date-display" type="text" data-v2-editor-identity-date-display="'+esc(key)+'" value="'+esc(formatted)+'" placeholder="25th April, 2025" aria-label="Date of Birth"'+(identityVisible?'':' disabled')+'>'+
    '<button type="button" class="editor-identity-date-button" data-v2-editor-open-date="'+esc(key)+'" aria-label="Choose Date of Birth"'+(identityVisible?'':' disabled')+'>▣</button>'+
    '<input class="editor-identity-date-picker" type="date" data-v2-editor-identity-field="'+esc(key)+'" aria-label="Choose Date of Birth" value="'+esc(raw)+'"'+(identityVisible?'':' disabled')+'>'+
    '</div>'+identityFieldActions(key,identityVisible,removable)+'</div>';
}

function renderField(sectionId,field,index,fieldIds,visible=true){
  const fieldVisible=visible&&field.visibility!==false;
  const up=moveOrder(fieldIds,index,-1),down=moveOrder(fieldIds,index,1);
  const typeOptions=['text','textarea','email','url','date'].map(type=>'<option value="'+type+'"'+(String(field.type||'text')===type?' selected':'')+'>'+type+'</option>').join('');
  const fieldType=String(field.type||'text');
  const valueControl=fieldVisible
    ? (fieldType==='textarea'
      ? '<textarea rows="5" data-v2-editor-field="'+esc(sectionId)+':'+esc(field.id)+'" value="'+esc(field.value)+'">'+esc(field.value)+'</textarea>'
      : '<input type="'+esc(fieldType==='email'||fieldType==='url'||fieldType==='date'?fieldType:'text')+'" data-v2-editor-field="'+esc(sectionId)+':'+esc(field.id)+'" value="'+esc(field.value)+'">')
    : '<div class="editor-hidden-note">This field is hidden from the CV.</div>';
  return '<div class="editor-field-card" data-v2-editor-field-wrapper="'+esc(sectionId)+':'+esc(field.id)+'" data-v2-editor-sortable="field" data-v2-section-id="'+esc(sectionId)+'" data-v2-item-id="'+esc(field.id)+'" data-v2-editor-field-hidden="'+String(!fieldVisible)+'">'+
    '<div class="editor-field-head"><div class="editor-field-definition"><input data-v2-editor-field-label="'+esc(sectionId)+':'+esc(field.id)+'" aria-label="Field label" value="'+esc(field.label||labelFor(field.id))+'"><select data-v2-editor-field-type="'+esc(sectionId)+':'+esc(field.id)+'" aria-label="Field type">'+typeOptions+'</select></div>'+
    '<div class="editor-inline-actions">'+visibilityButton('field',{sectionId,fieldId:field.id},fieldVisible)+actionButton('Move Up','reorder',{kind:'field',sectionId},{order:up})+actionButton('Move Down','reorder',{kind:'field',sectionId},{order:down})+'</div></div>'+valueControl+'</div>';
}

function renderSummaryField(sectionId,field,visible=true){
  const fieldVisible=visible&&field.visibility!==false;
  return '<div class="editor-summary-field" data-v2-editor-field-wrapper="'+esc(sectionId)+':'+esc(field.id)+'" data-v2-editor-field-hidden="'+String(!fieldVisible)+'">'+
    (fieldVisible?'<textarea rows="7" data-v2-editor-field="'+esc(sectionId)+':'+esc(field.id)+'" aria-label="Professional Summary">'+esc(field.value||'')+'</textarea>':'<div class="editor-hidden-note">Professional Summary is hidden from the CV. Use the section eye button to show it again.</div>')+
    '</div>';
}

function summarySuggestionButton(section){
  if(String(section?.type||'')!=='summary') return '';
  return '<div class="editor-summary-tools"><button type="button" class="editor-summary-suggest" data-v2-summary-suggest>✦ Auto Suggestion</button></div>';
}

function sortEntriesForEditor(entries,sectionType,direction){
  const list=Array.isArray(entries)?[...entries]:[];
  if(!new Set(['experience','education']).has(String(sectionType))) return list;
  const key=e=>{const v=e?.values||{};if(sectionType==='experience')return String(v.startDate||v.dates||'');const m=String(v.dates||v.startDate||'').match(/(19\d{2}|20\d{2}|21\d{2})/g);return m?.[0]||String(v.dates||'');};
  return list.sort((a,b)=>{const ad=key(a),bd=key(b);if(ad!==bd)return direction==='asc'?ad.localeCompare(bd):bd.localeCompare(ad);return (Number(a.order)||0)-(Number(b.order)||0);});
}

function formatMonthValue(value){
  const raw=String(value||'').trim();
  if(!/^\d{4}-\d{2}$/.test(raw))return raw;
  const [year,month]=raw.split('-').map(Number);
  if(!year||month<1||month>12)return raw;
  return new Intl.DateTimeFormat('en-US',{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(Date.UTC(year,month-1,1)));
}
function renderEntry(sectionId,entry,index,entryIds,visible=true){
  const values=entry.values&&typeof entry.values==='object'?entry.values:{};
  const entryVisible=visible&&entry.visibility!==false;
  const up=moveOrder(entryIds,index,-1),down=moveOrder(entryIds,index,1);
  const isExperience=String(sectionId).toLowerCase()==='experience';
  const isEducation=String(sectionId).toLowerCase()==='education';
  const autoSorted=isExperience||isEducation;
  const entryKeys=isExperience?['role','company','startDate','endDate','description']:isEducation?['degree','institution','dates']:Object.keys(values);
  const fields=entryVisible?entryKeys.map(key=>{
    const value=values[key]==null?'':values[key];
    const isMonthField=isExperience&&(key==='startDate'||key==='endDate');
    const inputType=isMonthField?'text':key==='description'?'textarea':'text';
    const inputValue=isMonthField?formatMonthValue(value):value;
    const extra=isMonthField?' inputmode="text" placeholder="February 2026" autocomplete="off"':'';
    const legacyHint=isExperience&&key==='startDate'&&!value&&values.dates?'<small class="editor-field-help">Legacy duration: '+esc(values.dates)+'. Enter Start/End month and year to replace it.</small>':'';
    const monthControls=isMonthField
      ? '<span class="editor-month-input-wrap"><input type="text" inputmode="text" placeholder="February 2026" autocomplete="off" data-v2-editor-entry-field data-v2-entry-date="month" data-v2-entry-key="'+esc(key)+'" data-v2-entry-target="'+attr({sectionId,entryId:entry.id})+'" value="'+esc(inputValue)+'">'+
        '<button type="button" class="editor-month-picker-button" aria-hidden="true" tabindex="-1" title="Choose '+esc(labelFor(key))+'"><span aria-hidden="true">▣</span></button>'+
        '<input type="month" class="editor-month-picker-native" data-v2-month-picker="'+esc(key)+'" aria-label="Choose '+esc(labelFor(key))+'" value="'+esc(value)+'" min="1900-01" max="2100-12"></span>'
      : '';
    return '<label class="editor-entry-field"><span>'+esc(labelFor(key))+'</span>'+(isMonthField
      ? monthControls
      : inputType==='textarea'
        ? '<textarea rows="4" data-v2-editor-entry-field data-v2-entry-key="'+esc(key)+'" data-v2-entry-target="'+attr({sectionId,entryId:entry.id})+'">'+esc(value)+'</textarea>'
        : '<input type="'+inputType+'"'+extra+' data-v2-editor-entry-field data-v2-entry-key="'+esc(key)+'" data-v2-entry-target="'+attr({sectionId,entryId:entry.id})+'" value="'+esc(inputValue)+'">')+legacyHint+'</label>';
  }).join(''):'<div class="editor-hidden-note">This entry is hidden from the CV.</div>';
  return '<article class="editor-entry-card" data-v2-editor-entry="'+esc(entry.id)+'" data-v2-editor-sortable="entry" data-v2-section-id="'+esc(sectionId)+'" data-v2-item-id="'+esc(entry.id)+'" data-v2-editor-entry-hidden="'+String(!entryVisible)+'">'+
    '<div class="editor-entry-head"><div><span class="editor-entry-kicker">ENTRY '+(index+1)+'</span><strong>'+esc(isExperience?'Work Experience':isEducation?'Education':'Entry')+'</strong></div><div class="editor-inline-actions">'+visibilityButton('entry',{sectionId,entryId:entry.id},entryVisible)+actionButton('Duplicate','duplicate-entry',{sectionId,entryId:entry.id})+actionButton('Remove','remove-entry',{sectionId,entryId:entry.id})+(autoSorted?'':actionButton('Move Up','reorder',{kind:'entry',sectionId},{order:up})+actionButton('Move Down','reorder',{kind:'entry',sectionId},{order:down}))+'</div></div>'+
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

function entrySortControl(sectionType,configuration){
  const selected=String(configuration?.presentation?.entrySort?.[sectionType]||'desc');
  return '<label class="editor-sort-control"><span>Date order</span><select data-v2-editor-entry-sort="'+esc(sectionType)+'" aria-label="'+esc(sectionType)+' date order"><option value="desc"'+(selected==='desc'?' selected':'')+'>Newest first</option><option value="asc"'+(selected==='asc'?' selected':'')+'>Oldest first</option></select></label>';
}

function ratingStyleControl(sectionType,configuration){
  const selected=String(configuration?.presentation?.ratings?.[sectionType]?.style||'off');
  return '<label class="editor-rating-style-control"><span>Rating</span><select data-v2-editor-rating-style="'+esc(sectionType)+'" aria-label="'+esc(sectionType)+' rating style">'+
    [['off','Off'],['stars','Stars'],['bars','Bars'],['dots','Dots']].map(([value,label])=>'<option value="'+value+'"'+(selected===value?' selected':'')+'>'+label+'</option>').join('')+
    '</select></label>';
}
function listStyleControl(sectionType,configuration){
  const defaults={skills:'tags',languages:'stacked'};
  const selected=String(configuration?.presentation?.listStyles?.[sectionType]||defaults[sectionType]);
  const options=sectionType==='skills'
    ? [['tags','Tags'],['inline','Inline'],['bullets','Bullets'],['compact','Compact']]
    : [['stacked','Stacked'],['inline','Inline'],['pills','Pills'],['compact','Compact']];
  return '<label class="editor-list-style-control"><span>Display style</span><select data-v2-editor-list-style="'+esc(sectionType)+'" aria-label="'+esc(sectionType)+' display style">'+
    options.map(([value,label])=>'<option value="'+value+'"'+(value===selected?' selected':'')+'>'+label+'</option>').join('')+
    '</select></label>';
}

function renderListField(sectionId,field,index,fieldIds,visible,itemLabel,configuration={}){
  const ratingConfig=configuration?.presentation?.ratings?.[sectionId]||{style:'off',values:{}};
  const items=String(field.value??'').split(/[,\\n]+/).map(v=>v.trim()).filter(Boolean);
  const ratingHtml=items.length
    ? '<div class="editor-rating-items"><div class="editor-rating-title">Optional '+esc(itemLabel)+' ratings</div>'+items.map(item=>{
        const rating=Math.max(0,Math.min(5,Number(ratingConfig.values?.[item]||0)));
        return '<div class="editor-rating-row"><span>'+esc(item)+'</span><select data-v2-editor-item-rating="'+esc(sectionId)+'" data-v2-rating-item="'+esc(item)+'" aria-label="'+esc(item)+' rating">'+[0,1,2,3,4,5].map(v=>'<option value="'+v+'"'+(v===rating?' selected':'')+'>'+ (v===0?'No rating':v+' / 5')+'</option>').join('')+'</select></div>';
      }).join('')+'</div>' : '';

  const fieldVisible=visible&&field.visibility!==false;
  const up=moveOrder(fieldIds,index,-1),down=moveOrder(fieldIds,index,1);
  const value=field.value==null?'':String(field.value);
  const placeholder=sectionId==='skills'?'JavaScript, HTML, CSS, Git, Testing':'English, Urdu, Punjabi';
  const hint=sectionId==='skills'
    ? 'Write each skill separated by a comma. Example: JavaScript, HTML, CSS, Git.'
    : 'Write each language separated by a comma. Example: English, Urdu, Punjabi.';
  return '<div class="editor-list-field-card" data-v2-editor-field-wrapper="'+esc(sectionId+':'+field.id)+'" data-v2-editor-field-hidden="'+String(!fieldVisible)+'">'+
    '<div class="editor-list-field-head"><div><span class="editor-entry-kicker">'+esc(itemLabel)+' '+(index+1)+'</span><strong>'+esc(sectionId==='skills'?'Skill list':'Language list')+'</strong></div>'+
    '<div class="editor-inline-actions">'+visibilityButton('field',{sectionId,fieldId:field.id},fieldVisible)+actionButton('Move Up','reorder',{kind:'field',sectionId},{order:up})+actionButton('Move Down','reorder',{kind:'field',sectionId},{order:down})+'</div></div>'+
    (fieldVisible
      ? '<label class="editor-list-field-label"><span>'+esc(itemLabel)+' content</span><input data-v2-editor-field="'+esc(sectionId)+':'+esc(field.id)+'" value="'+esc(value)+'" placeholder="'+esc(placeholder)+'"><small class="editor-field-help">'+esc(hint)+'</small></label>'
      : '<div class="editor-hidden-note">This '+esc(itemLabel.toLowerCase())+' is hidden from the CV.</div>')+
    '</div>';
}

function renderPhotoCard(documentData,photoShape='circle',configuration={}){
  const assets=Array.isArray(documentData.careerData?.assets)?documentData.careerData.assets:[];
  const photo=assets.find(item=>String(item?.key||item?.id||'')==='profile-photo');
  const hasPhoto=Boolean(photo?.url||photo?.src); const photoVisible=!hasConfiguredKey(configuration.hiddenAssets||[],'profile-photo');
  const shape=String(photoShape||'circle');
  const radius=shape==='circle'?'50%':shape==='square'?'8px':'14px';
  return '<section class="editor-photo-card" data-v2-editor-photo>'+
    '<div class="editor-panel-title"><div><span class="editor-eyebrow">PHOTO</span><h3>Profile Photo</h3></div><div class="editor-photo-head-tools">'+(hasPhoto?actionButton(photoVisible?'Hide':'Show','set-visibility',{kind:'asset',assetId:'profile-photo'},{visible:!photoVisible},'photo-visibility') :'')+'</div></div>'+
    '<div class="editor-photo-layout"><div class="editor-photo-frame '+esc(shape)+'" style="border-radius:'+radius+'">'+(hasPhoto?'<img class="editor-photo-preview" src="'+esc(photo.url||photo.src)+'" alt="Profile photo preview">':'<div class="editor-photo-placeholder">No photo</div>')+'</div>'+
    '<div class="editor-photo-copy"><strong>'+(hasPhoto?'Photo ready':'Add a profile photo')+'</strong><p>'+(hasPhoto?'Crop and position the image without changing the template shape.':'Upload JPG, PNG or WebP up to 2 MB.')+'</p><div class="editor-photo-actions"><label class="editor-photo-upload">'+(hasPhoto?'Change Photo':'Upload Photo')+'<input type="file" accept="image/*" data-v2-editor-photo-input hidden></label>'+(hasPhoto?'<button type="button" class="editor-photo-crop" data-v2-editor-photo-crop="profile-photo">Adjust Crop</button>':'')+'</div></div></div></section>';
}

export function renderEditorForm(surface,documentData,options={}){
  if(!surface||!documentData)throw new Error('Editor surface and document data are required.');
  const configuration=options.configuration||surface.getState()?.session?.application?.targetedCV?.configuration||{};
  const hiddenSections=Array.isArray(configuration.hiddenSections)?configuration.hiddenSections.map(String):[];
  const hiddenFields=Array.isArray(configuration.hiddenFields)?configuration.hiddenFields.map(String):[];
  const hiddenEntries=Array.isArray(configuration.hiddenEntries)?configuration.hiddenEntries.map(String):[];
  const hiddenIdentityFields=Array.isArray(configuration.hiddenIdentityFields)?configuration.hiddenIdentityFields.map(String):[];
  const identity=documentData.careerData?.identity&&typeof documentData.careerData.identity==='object'?documentData.careerData.identity:{};
  const BASE_IDENTITY_KEYS=new Set(['fullName','jobTitle','email','phone','location']);
  const OPTIONAL_IDENTITY_KEYS=[
    ['website','Website'],['linkedin','LinkedIn'],['whatsapp','WhatsApp'],
    ['dateOfBirth','Date of Birth'],['cnic','CNIC'],['religion','Religion'],['nationality','Nationality'],['gender','Gender'],['maritalStatus','Marital Status']
  ];
  const configuredIdentityFields=Array.isArray(configuration.identityFields)?configuration.identityFields.map(String):[];
  const legacyPresentIdentityFields=OPTIONAL_IDENTITY_KEYS.map(item=>item[0]).filter(key=>identity[key]!==undefined);
  const activeIdentityFields=new Set([...configuredIdentityFields,...legacyPresentIdentityFields]);
  const identityGroups=[
    {id:'identity',title:'Name & Professional',keys:['fullName','jobTitle'],add:[]},
    {id:'contact',title:'Contact Information',keys:['email','phone','location',...OPTIONAL_IDENTITY_KEYS.slice(0,3).map(item=>item[0])],add:OPTIONAL_IDENTITY_KEYS.slice(0,3).map(item=>item[0])},
    {id:'personal',title:'Personal Information',keys:OPTIONAL_IDENTITY_KEYS.slice(3).map(item=>item[0]),add:OPTIONAL_IDENTITY_KEYS.slice(3).map(item=>item[0])}
  ];
  const customKeys=Object.keys(identity).filter(key=>!BASE_IDENTITY_KEYS.has(key)&&!OPTIONAL_IDENTITY_KEYS.some(item=>item[0]===key));
  if(customKeys.length) identityGroups[2].keys=[...identityGroups[2].keys,...customKeys];
  const identityGroupHtml=group=>{
    const fields=group.keys.filter(key=>BASE_IDENTITY_KEYS.has(key)||activeIdentityFields.has(String(key)));
    const addOptions=group.add.filter(key=>!activeIdentityFields.has(String(key))).map(key=>'<option value="'+esc(key)+'">Add '+esc(labelFor(key))+'</option>').join('')+
      (group.id==='personal'?'<option value="custom">Add Custom Field…</option>':'');
    return '<section class="editor-identity-block"><div class="editor-identity-head"><div><span class="editor-eyebrow">'+esc(group.id==='identity'?'IDENTITY':group.id==='contact'?'CONTACT':'PERSONAL')+'</span><h4>'+esc(group.title)+'</h4></div>'+((group.id!=='identity'&&addOptions)?'<select class="editor-identity-add" data-v2-editor-identity-add aria-label="Add '+esc(group.title)+' field"><option value="">+ Add Field</option>'+addOptions+'</select>':'')+'</div><div class="editor-identity-grid">'+fields.map(key=>{
      const removable=!BASE_IDENTITY_KEYS.has(String(key));
      const identityVisible=!hiddenIdentityFields.includes(String(key));
      const value=identity[key]??'';
      if(key==='dateOfBirth') return '<label class="editor-identity-field'+(identityVisible?'':' is-hidden')+'"><span>'+esc(labelFor(key))+'</span><div class="editor-identity-input-wrap">'+renderIdentityDateField(key,value,identityVisible,removable)+'</div></label>';
      return '<label class="editor-identity-field'+(identityVisible?'':' is-hidden')+'"><span>'+esc(labelFor(key))+'</span><div class="editor-identity-input-wrap"><div class="editor-identity-field-control"><input type="text" data-v2-editor-identity-field="'+esc(key)+'" aria-label="'+esc(labelFor(key))+'" value="'+esc(value)+'"'+(identityVisible?'':' disabled')+'>'+identityFieldActions(key,identityVisible,removable)+'</div></div></label>';
    }).join('')+'</div></section>';
  };
  const identityHtml=identityGroups.map(identityGroupHtml).join('');
  const sections=orderItems(documentData.careerData?.sections||[],configuration.sectionOrder||[]);
  const sectionIds=sections.map(s=>s.id);

  const sectionsHtml=sections.filter(section=>section.visibility!==false).map((section,sectionIndex)=>{
    const sid=String(section.id),type=String(section.type||'custom').toLowerCase(),isCore=CORE_SECTIONS.has(type),sectionHidden=hasConfiguredKey(hiddenSections,sid)||hasConfiguredKey(hiddenSections,type);
    const fields=orderItems(section.fields||[],configuration.fieldOrder?.[sid]||[]);
    const fieldIds=fields.map(f=>f.id);
    const sortDirection=String(configuration?.presentation?.entrySort?.[type]||'desc');
    const placement=String(configuration?.presentation?.sectionPlacement?.[sid]||'left');
    const entries=sortEntriesForEditor(orderItems(section.entries||[],configuration.entryOrder?.[sid]||[]),type,sortDirection);
    const entryIds=entries.map(e=>e.id);
    const sectionUp=moveOrder(sectionIds,sectionIndex,-1),sectionDown=moveOrder(sectionIds,sectionIndex,1);
    const fieldHtml=!sectionHidden&&type!=='experience'&&type!=='education'
      ? (type==='skills'||type==='languages'
        ? fields.map((field,index)=>renderListField(sid,field,index,fieldIds,!hasConfiguredKey(hiddenFields,sid+':'+field.id),type==='skills'?'Skill':'Language',configuration)).join('')
        : fields.map((field,index)=>type==='summary'?renderSummaryField(sid,field,!hasConfiguredKey(hiddenFields,sid+':'+field.id)):renderField(sid,field,index,fieldIds,!hasConfiguredKey(hiddenFields,sid+':'+field.id))).join(''))
      : '';
    const entryHtml=!sectionHidden?entries.map((entry,index)=>renderEntry(sid,entry,index,entryIds,!hasConfiguredKey(hiddenEntries,sid+':'+entry.id))).join(''):'';
    const addButton=type==='experience'?'Add Experience':type==='education'?'Add Education':('Add '+(section.title||labelFor(type)));
    const canAddEntry=section.repeatable;
    const canAddField=!section.repeatable&&type!=='photo'&&type!=='summary';
    return '<section class="editor-section-card'+(sectionHidden?' is-hidden':'')+'" data-v2-editor-section="'+esc(sid)+'" data-v2-editor-sortable="section" data-v2-item-id="'+esc(sid)+'" data-v2-editor-section-hidden="'+String(sectionHidden)+'">'+
      '<div class="editor-section-banner"><div class="editor-section-title-wrap"><span class="editor-section-icon">'+esc(type==='experience'?'WORK':type==='education'?'EDU':type==='skills'?'SKILLS':type==='languages'?'LANG':type==='summary'?'SUMMARY':'SECTION')+'</span><div><h3>'+esc(section.title||labelFor(type))+'</h3><span class="editor-section-status">'+(sectionHidden?'Hidden from CV':'Visible in CV')+'</span></div></div>'+
      '<div class="editor-section-banner-tools">'+((type==='skills'||type==='languages')&&!sectionHidden?listStyleControl(type,configuration)+ratingStyleControl(type,configuration):'')+((type==='experience'||type==='education')&&!sectionHidden?entrySortControl(type,configuration):'')+
      (!isCore?'<label class="editor-placement-control"><span>Show in</span><select data-v2-editor-section-placement="'+esc(sid)+'" aria-label="Section column"><option value="left"'+(placement==='left'?' selected':'')+'>Left column</option><option value="right"'+(placement==='right'?' selected':'')+'>Right column</option></select></label>':'')+
      '<div class="editor-section-actions">'+visibilityButton('section',{sectionId:sid},!sectionHidden)+(isCore?'':actionButton('Remove','remove-section',{sectionId:sid}))+actionButton('Move Up','reorder',{kind:'section'},{order:sectionUp})+actionButton('Move Down','reorder',{kind:'section'},{order:sectionDown})+'</div></div></div>'+
      (isCore?'':'<div class="editor-custom-title"><label>Section name<input data-v2-editor-section-title="'+esc(sid)+'" value="'+esc(section.title||'New Section')+'"></label></div>')+
      (!sectionHidden?'<div class="editor-section-content">'+fieldHtml+(type==='summary'?summarySuggestionButton(section):'')+entryHtml+(canAddEntry?'<button type="button" class="editor-add-entry" data-v2-editor-command="add-entry" data-v2-target="'+attr({sectionId:sid})+'" data-v2-payload="'+attr({values:{}})+'">+ '+esc(addButton)+'</button>':'')+(canAddField?'<button type="button" class="editor-add-field" data-v2-editor-command="add-field" data-v2-target="'+attr({sectionId:sid})+'" data-v2-payload="'+attr({type:'text',label:type==='skills'?'Skill':type==='languages'?'Language':'New Field',value:''})+'">+ '+esc(type==='skills'?'Add Skill':type==='languages'?'Add Language':'Add Field')+'</button>':'')+'</div>':'<div class="editor-hidden-section-note">This section is hidden. Use the eye button to show it again.</div>')+
      '</section>';
  }).join('');

  return Object.freeze({
    version:EDITOR_FORM_RENDERER_VERSION,
    html:renderPalette(configuration)+renderPhotoCard(documentData,options.photoShape||'circle',configuration)+
      '<section class="editor-section-card editor-identity-card"><div class="editor-section-banner"><div class="editor-section-title-wrap"><span class="editor-section-icon">PROFILE</span><div><h3>Profile Information</h3><span class="editor-section-status">Keep your identity, contact and personal details organized</span></div></div></div><div class="editor-section-content">'+identityHtml+'</div></section>'+
      sectionsHtml+
      '<button type="button" class="editor-add-section" data-v2-editor-command="add-section" data-v2-editor-target="{}" data-v2-target="'+attr({})+'" data-v2-payload="'+attr({title:'New Section',type:'custom',repeatable:false})+'">+ Add Custom Section</button>',
    sectionCount:sections.length
  });
}
