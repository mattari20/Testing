import { createAIResult, AI_TASK } from '../application/cv-ai-intelligence.js';
import { createPrivacyPolicy, VISIBILITY } from '../security/security-privacy-engine.js';

export const CV_FINAL_PRODUCT_HUB_VERSION='1.0.0';
const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));

export function createCVFinalProductHub(options={}){
 const document=options.document,runtime=options.runtime,container=options.container;
 if(!document||!runtime||!container) throw new Error('Final product hub requires document, runtime and container.');
 const surface=runtime.surface;
 let aiResult=null;
 const root=document.createElement('section'); root.className='final-product-hub'; root.setAttribute('data-final-product-hub','true');
 const tabs=document.createElement('div'); tabs.className='final-product-tabs';
 const body=document.createElement('div'); body.className='final-product-body';
 const names=['AI Review','Career Mode','Cover Letter','Import / Migration','Online CV','Portfolio','Plans & Privacy'];
 names.forEach((name,i)=>{const b=document.createElement('button');b.type='button';b.textContent=name;b.dataset.tab=String(i);b.className=i===0?'active':'';b.onclick=()=>show(i);tabs.appendChild(b);});
 root.append(tabs,body); container.replaceChildren(root);

 function card(title,text=''){const c=document.createElement('div');c.className='final-card';const h=document.createElement('h3');h.textContent=title;c.append(h);if(text){const p=document.createElement('p');p.textContent=text;c.append(p);}return c;}
 function show(i){
  tabs.querySelectorAll('button').forEach((b,n)=>b.classList.toggle('active',n===i)); body.replaceChildren();
  if(i===0) renderAI();
  if(i===1) renderCareer();
  if(i===2) renderLetter();
  if(i===3) renderImport();
  if(i===4) renderOnline();
  if(i===5) renderPortfolio();
  if(i===6) renderPlans();
 }
 function renderAI(){
  const c=card('AI Review','AI output must remain reviewable. Nothing is applied automatically.');
  const task=document.createElement('select'); Object.values(AI_TASK).forEach(v=>{const o=document.createElement('option');o.value=v;o.textContent=v;task.append(o);});
  const run=document.createElement('button');run.textContent='Generate Review';run.className='primary';
  const out=document.createElement('div');out.className='final-results';
  run.onclick=()=>{const state=runtime.getState();const profile=state.session.application.masterProfile;const sections=profile?.careerData?.sections||[];const summary=sections.find(s=>s.id==='summary');const field=summary?.fields?.[0];const suggestions=[];
   if(field&&String(field.value||'').length<80)suggestions.push({id:'summary-improve',title:'Strengthen professional summary',explanation:'The current summary is short. Consider adding role, strengths and measurable value.',blockType:'field',target:{sectionId:'summary',fieldId:field.id},suggestedValue:'Experienced professional focused on delivering measurable results, collaborating effectively, and continuously improving processes.'});
   if(!sections.some(s=>s.id==='skills'))suggestions.push({id:'skills-add',title:'Add a Skills section',explanation:'A dedicated skills section improves discoverability for structured screening.',blockType:'section',target:{sectionId:'skills'},suggestedValue:''});
   aiResult=createAIResult({version:'1.0.0',task:task.value,documentSnapshot:clone(state),jobContext:null},{status:'ready',suggestions,explanation:'Deterministic local review suggestions. External AI provider is optional and never applied without user approval.',requiresReview:true});
   renderAIResult(out);
  };
  c.append(task,run,out);body.append(c);
 }
 function renderAIResult(out){
  out.replaceChildren(); const list=aiResult?.suggestions||[];
  if(!list.length){const p=document.createElement('p');p.textContent='No automatic suggestion was generated. Your CV passes the local review baseline.';out.append(p);return;}
  list.forEach((s,i)=>{const row=card(s.title,s.explanation);const accept=document.createElement('button');accept.textContent='Accept';accept.className='primary';const reject=document.createElement('button');reject.textContent='Reject';accept.onclick=()=>{try{if(s.blockType==='field'){surface.dispatch({type:'set-field',target:s.target,payload:{value:s.suggestedValue}});}else{surface.dispatch({type:'add-section',target:{},payload:{section:{id:'skills',type:'skills',title:'Skills',visibility:true,fields:[{id:'skillsText',type:'text',label:'Skills',value:'Add your skills here',visibility:true}],entries:[],repeatable:false}}});}row.remove();}catch(e){row.dataset.error=e.message;}};reject.onclick=()=>row.remove();row.append(accept,reject);out.append(row);});
 }
 function renderCareer(){
  const c=card('Career Mode','Choose the content emphasis. This does not delete existing data.');
  const select=document.createElement('select');['General','Student / Fresh Graduate','Professional','Academic'].forEach(v=>{const o=document.createElement('option');o.textContent=v;o.value=v;select.append(o);});
  const info=document.createElement('p');info.textContent='Student mode emphasizes education, projects, internships and achievements. Academic mode emphasizes research, publications, thesis, conferences and teaching.';
  select.onchange=()=>{info.dataset.mode=select.value;};
  c.append(select,info);body.append(c);
 }
 function renderLetter(){
  const c=card('Cover Letter Builder','Create a first draft from the current CV. Review and edit before use.');
  const role=document.createElement('input');role.placeholder='Target role';const company=document.createElement('input');company.placeholder='Company / organization';
  const generate=document.createElement('button');generate.textContent='Create Draft';generate.className='primary';const out=document.createElement('textarea');out.rows=12;out.style.width='100%';
  generate.onclick=()=>{const s=runtime.getState();const id=s.session.application.masterProfile?.careerData?.identity||{};out.value='Dear Hiring Manager,\n\nI am writing to apply for the '+(role.value||'position')+' opportunity at '+(company.value||'your organization')+'. My background and skills described in my CV have prepared me to contribute effectively to this role.\n\nI would welcome the opportunity to discuss how my experience can support your team.\n\nSincerely,\n'+(id.fullName||'Your Name');};
  c.append(role,company,generate,out);body.append(c);
 }
 function renderImport(){
  const c=card('Import / Migration Intake','Local-first intake is available now. PDF/DOCX extraction requires a dedicated parser boundary and is not silently simulated.');
  const input=document.createElement('input');input.type='file';input.accept='.json,.pdf,.docx';
  const out=document.createElement('p');input.onchange=async()=>{const file=input.files?.[0];if(!file)return;if(file.name.toLowerCase().endsWith('.json')){try{const data=JSON.parse(await file.text());out.textContent='JSON profile imported for review. Authoritative application remains user-controlled.';}catch{out.textContent='Invalid JSON import.';}}else out.textContent='File received: '+file.name+'. Extraction/review boundary is ready, but this browser build does not claim PDF/DOCX parsing until its parser is production-enabled.';};c.append(input,out);body.append(c);
 }
 function renderOnline(){
  const c=card('Online CV Publication','Prepare privacy-controlled publication settings. Actual public hosting requires the account/server publication service.');
  const select=document.createElement('select');[VISIBILITY.PRIVATE,VISIBILITY.LINK_ONLY,VISIBILITY.PUBLIC].forEach(v=>{const o=document.createElement('option');o.value=v;o.textContent=v;select.append(o);});
  const download=document.createElement('label');const cb=document.createElement('input');cb.type='checkbox';download.append(cb,' Allow download');
  const search=document.createElement('label');const sb=document.createElement('input');sb.type='checkbox';search.append(sb,' Allow search indexing');
  const prepare=document.createElement('button');prepare.textContent='Prepare Publication';prepare.className='primary';const out=document.createElement('p');
  prepare.onclick=()=>{const policy=createPrivacyPolicy({visibility:select.value,downloadable:cb.checked,searchIndexing:sb.checked});out.textContent='Publication policy prepared: '+policy.visibility+'. No public URL was created in this local-first build.';};
  c.append(select,download,search,prepare,out);body.append(c);
 }
 function renderPortfolio(){
  const c=card('Portfolio Links','Keep external portfolio links separate from generated CV content.');
  const input=document.createElement('input');input.placeholder='https://example.com/portfolio';const add=document.createElement('button');add.textContent='Add Link';add.className='primary';const list=document.createElement('ul');
  add.onclick=()=>{try{const u=new URL(input.value);if(!/^https?:$/.test(u.protocol))throw 0;const li=document.createElement('li');li.textContent=u.href;list.append(li);input.value='';}catch{input.setCustomValidity('Enter a valid HTTP(S) URL.');input.reportValidity();}};c.append(input,add,list);body.append(c);
 }
 function renderPlans(){
  const c=card('Plans, Entitlements & Privacy','Capability access is kept separate from feature logic. No payment provider is embedded in the editor.');
  ['Free core builder','Premium templates — entitlement-ready','Advanced intelligence — entitlement-ready','AI packages — provider/entitlement-ready','Ad-free option — entitlement-ready'].forEach(x=>{const p=document.createElement('p');p.textContent='• '+x;c.append(p);});
  const privacy=document.createElement('p');privacy.textContent='Privacy boundary: local-first storage; analytics must not receive raw CV content by default.';c.append(privacy);body.append(c);
 }
 show(0);
 return Object.freeze({version:CV_FINAL_PRODUCT_HUB_VERSION,root,show,destroy(){root.remove();}});
}
