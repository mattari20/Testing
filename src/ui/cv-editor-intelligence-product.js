import { createCVIntelligenceCoordinator } from '../application/cv-intelligence-coordinator.js';

export const CV_EDITOR_INTELLIGENCE_PRODUCT_VERSION='1.0.0';

function el(document,tag,textContent='',className=''){
  const node=document.createElement(tag);
  if(textContent) node.textContent=textContent;
  if(className) node.className=className;
  return node;
}

export function createCVEditorIntelligenceProduct(options={}){
  const document=options.document;
  const runtime=options.runtime;
  const container=options.container;
  if(!document||!runtime||!container) throw new Error('Intelligence product requires document, runtime and container.');

  const coordinator=options.coordinator||createCVIntelligenceCoordinator({runtime});
  const panel=el(document,'div','','cv-intelligence-product');
  panel.setAttribute('data-cv-intelligence-product','true');

  const head=el(document,'div','','cv-intelligence-head');
  const title=el(document,'strong','Resume Intelligence');
  const note=el(document,'span','Heuristic analysis — use findings as guidance, not as a hiring decision.');
  head.append(title,note);

  const controls=el(document,'div','','cv-intelligence-controls');
  const keywordsLabel=el(document,'label','Job keywords / description');
  keywordsLabel.setAttribute('for','cv-intelligence-job');
  const input=el(document,'textarea');
  input.id='cv-intelligence-job';
  input.rows=4;
  input.placeholder='Paste job keywords or a short job description…';
  const analyzeButton=el(document,'button','Analyze CV','primary');
  analyzeButton.type='button';
  controls.append(keywordsLabel,input,analyzeButton);

  const results=el(document,'div','','cv-intelligence-results');
  const summary=el(document,'div','','cv-intelligence-summary');
  const ats=el(document,'div','','cv-intelligence-card');
  const match=el(document,'div','','cv-intelligence-card');
  const skills=el(document,'div','','cv-intelligence-card');
  const health=el(document,'div','','cv-intelligence-card');
  results.append(summary,ats,match,skills,health);
  panel.append(head,controls,results);
  container.replaceChildren(panel);

  function terms(){
    return String(input.value||'').toLowerCase().split(/[^a-z0-9+#. -]+/).flatMap(v=>v.split(/\s+/)).map(v=>v.trim()).filter(v=>v.length>2);
  }
  function renderCard(node,title,value,detail){
    node.replaceChildren(el(document,'h4',title),el(document,'strong',value),el(document,'p',detail));
  }
  function runAnalysis(){
    const words=[...new Set(terms())];
    const result=coordinator.inspect({keywords:words,description:input.value},{keywords:words,metadata:{source:'editor-intelligence'}});
    const a=result.ats;
    const j=result.jobMatch;
    const matched=j.matchedCount;
    const missing=j.missing;
    const checks=a.checks||[];
    const passed=checks.filter(c=>c.passed).length;
    renderCard(summary,'Overall snapshot',passed+' / '+checks.length+' core checks passed', 'Active CV: '+(result.targetedCVId||'current')+'. Results are explainable rule-based signals.');
    renderCard(ats,'ATS Readiness',a.score+' / 100',a.score>=80?'Core structure and requested keywords are largely present.': 'Review the failed checks below before relying on this CV for ATS-heavy applications.');
    renderCard(match,'Job Match',Math.round(j.matchRatio*100)+'%',matched+' of '+j.keywordCount+' requested terms were found in the CV text.');
    renderCard(skills,'Skill / Keyword Evidence',missing.length?missing.slice(0,8).join(', '):'No missing requested terms','Matched: '+(j.matched.length?j.matched.slice(0,8).join(', '):'none')+(missing.length>8?' …':''));
    const failed=checks.filter(c=>!c.passed).map(c=>c.id);
    renderCard(health,'Resume Health',failed.length?'Needs attention':'Healthy baseline',failed.length?'Review: '+failed.join(', ')+'.':'Identity, sections, fields and entries are present.');
    results.hidden=false;
  }
  analyzeButton.addEventListener('click',()=>{try{runAnalysis();}catch(error){results.replaceChildren(el(document,'p','Analysis failed: '+(error?.message||error)));}});
  results.hidden=true;

  return Object.freeze({version:CV_EDITOR_INTELLIGENCE_PRODUCT_VERSION,coordinator,panel,input,analyze:analyzeButton,destroy(){panel.remove();coordinator.destroy();}});
}
