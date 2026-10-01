export const CV_EDITOR_UX_ACCEPTANCE_VERSION='1.0.0';
export function createCVEditorUXAcceptance(options={}) {
 const application=options.application;
 if(!application) throw new Error('UX acceptance requires browser application.');
 function inspect(){
  return Object.freeze({
   browserApplication:!!application,
   page:!!application.page,
   model:!!application.model,
   composition:!!application.composition,
   readiness:!!application.composition?.readiness,
   editorRoot:!!application.page?.shell?.root
  });
 }
 function ready(){const s=inspect();return Object.values(s).every(Boolean);}
 return Object.freeze({version:CV_EDITOR_UX_ACCEPTANCE_VERSION,inspect,ready});
}