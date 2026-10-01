export const CV_EDITOR_DOM_SHELL_VERSION='1.0.0';
const text=(doc,value)=>doc.createTextNode(String(value??''));
export function createCVEditorDOMShell(options={}) {
 const document=options.document;if(!document)throw new Error('DOM shell requires document.');
 const root=options.root||document.createElement('div');
 root.setAttribute('data-cv-editor','v2');
 const toolbar=document.createElement('header');toolbar.setAttribute('data-cv-editor-toolbar','');
 const main=document.createElement('main');main.setAttribute('data-cv-editor-main','');
 const form=document.createElement('section');form.setAttribute('data-cv-editor-form','');
 const preview=document.createElement('section');preview.setAttribute('data-cv-editor-preview','');
 const status=document.createElement('div');status.setAttribute('data-cv-editor-status','');
 const title=document.createElement('h1');title.appendChild(text(document,options.title||'CV Builder'));
 toolbar.appendChild(title);main.appendChild(form);main.appendChild(preview);root.appendChild(toolbar);root.appendChild(main);root.appendChild(status);
 function setStatus(message,type='info'){status.textContent=String(message||'');status.setAttribute('data-status-type',type);}
 function clear(){while(form.firstChild)form.removeChild(form.firstChild);while(preview.firstChild)preview.removeChild(preview.firstChild);}
 return Object.freeze({version:CV_EDITOR_DOM_SHELL_VERSION,root,toolbar,main,form,preview,status,setStatus,clear});
}