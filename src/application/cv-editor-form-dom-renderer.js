export const CV_EDITOR_FORM_DOM_RENDERER_VERSION='1.0.0';
const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
function make(doc,tag,attrs={},value){const n=doc.createElement(tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,String(v));if(value!=null)n.textContent=String(value);return n;}
export function createCVEditorFormDOMRenderer(options={}) {
 const document=options.document;if(!document)throw new Error('Form renderer requires document.');
 let destroyed=false;
 function render(container,model){if(destroyed)return null;if(!container||!model)throw new Error('Form renderer requires container and model.');while(container.firstChild)container.removeChild(container.firstChild);
  for(const section of model.sections||[]){const wrap=make(document,'section',{'data-section-id':section.id,'data-section-visible':section.visibility});const heading=make(document,'h2',{},section.title||section.id);wrap.appendChild(heading);
   for(const field of section.fields||[]){const row=make(document,'label',{'data-field-id':field.id,'data-field-type':field.type||'text'});row.appendChild(make(document,'span',{},field.label||field.id));const input=make(document,field.type==='textarea'?'textarea':'input',{'name':field.id,'data-block-id':field.id,'data-field-visibility':field.visibility});if(field.type!=='textarea')input.setAttribute('type',field.type||'text');input.value=field.value==null?'':String(field.value);row.appendChild(input);wrap.appendChild(row);}
   for(const entry of section.entries||[]){const e=make(document,'article',{'data-entry-id':entry.id,'data-entry-visible':entry.visibility});for(const [key,value] of Object.entries(clone(entry.values||{}))){const row=make(document,'label',{'data-entry-field':key});row.appendChild(make(document,'span',{},key));const input=make(document,'input',{'name':key,'data-block-id':entry.id});input.value=value==null?'':String(value);row.appendChild(input);e.appendChild(row);}wrap.appendChild(e);}
   container.appendChild(wrap);
  } return model;
 }
 return Object.freeze({version:CV_EDITOR_FORM_DOM_RENDERER_VERSION,render,destroy(){destroyed=true;}});
}