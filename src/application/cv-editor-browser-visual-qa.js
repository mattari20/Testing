export const CV_EDITOR_BROWSER_VISUAL_QA_VERSION='1.0.0';
const selectors=Object.freeze({
 root:'[data-cv-editor="v2"]',
 toolbar:'[data-cv-editor-toolbar]',
 main:'[data-cv-editor-main]',
 form:'[data-cv-editor-form]',
 preview:'[data-cv-editor-preview]',
 status:'[data-cv-editor-status]',
 page:'[data-cv-editor-preview] article',
 template:'[data-template-card]'
});
const readRect=node=>{const rect=node?.getBoundingClientRect?.();return rect?{width:rect.width,height:rect.height,top:rect.top,left:rect.left}:null;};
export function inspectCVEditorBrowserSurface(options={}){
 const document=options.document,window=options.window||document?.defaultView;
 if(!document)throw new Error('Browser visual QA requires document.');
 const root=document.querySelector?.(selectors.root)||null;
 const present=Object.fromEntries(Object.entries(selectors).map(([key,selector])=>[key,Boolean(root?.querySelector?.(selector)||document.querySelector?.(selector))]));
 const nodes={root,toolbar:document.querySelector?.(selectors.toolbar),main:document.querySelector?.(selectors.main),form:document.querySelector?.(selectors.form),preview:document.querySelector?.(selectors.preview),status:document.querySelector?.(selectors.status)};
 const metrics=Object.fromEntries(Object.entries(nodes).map(([key,node])=>[key,readRect(node)]));
 const computed=(node)=>window?.getComputedStyle&&node?window.getComputedStyle(node):null;
 const styles={
  rootBackground:computed(nodes.root)?.backgroundColor||null,
  rootColor:computed(nodes.root)?.color||null,
  toolbarBackground:computed(nodes.toolbar)?.backgroundColor||null,
  formBackground:computed(nodes.form)?.backgroundColor||null,
  previewBackground:computed(nodes.preview)?.backgroundColor||null
 };
 const pages=[...(document.querySelectorAll?.(selectors.page)||[])].map(readRect);
 const templates=[...(document.querySelectorAll?.(selectors.template)||[])].length;
 const failures=[];
 if(!present.root||!present.toolbar||!present.main||!present.form||!present.preview)failures.push('core-surface');
 if(present.form&&metrics.form&&metrics.form.width<=0)failures.push('form-width');
 if(present.preview&&metrics.preview&&metrics.preview.width<=0)failures.push('preview-width');
 if(pages.some(page=>page&&page.width<=0))failures.push('preview-page-width');
 return Object.freeze({version:CV_EDITOR_BROWSER_VISUAL_QA_VERSION,ready:failures.length===0,selectors,present,metrics,styles,pageCount:pages.length,templateCount:templates,failures});
}
export const CV_EDITOR_BROWSER_VISUAL_QA_CHECKS=Object.freeze([
 'core-surface','toolbar','responsive-width','form-visibility','preview-visibility','preview-pages','template-gallery','status-region','brand-colors','focus-states','mobile-layout','print-layout'
]);