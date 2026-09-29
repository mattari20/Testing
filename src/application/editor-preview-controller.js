import { createTemplatePreviewRequest, PREVIEW_MODE } from '../templates/template-preview.js';
import { createApplicationSnapshot, assembleApplicationDocument } from './cv-application.js';
import { createPreviewRequest } from '../preview/preview-engine.js';

export const EDITOR_PREVIEW_CONTROLLER_VERSION = '1.1.0';

export function createEditorPreview(editorSession, options={}) {
  if(!editorSession?.application) throw new Error('Editor session is required.');
  const {masterProfile,targetedCV}=editorSession.application;
  const templateId=options.templateId || targetedCV.configuration?.template?.id;
  if(!templateId) throw new Error('A template must be selected before preview.');
  const previewRequest=createTemplatePreviewRequest(templateId,{mode:PREVIEW_MODE.MY_DATA,masterProfileId:masterProfile.id,privateDataAuthorized:true,templates:options.templates});
  const assembly=assembleApplicationDocument(editorSession.application,{templateId,templateVersion:previewRequest.templateVersion,pageModel:options.pageModel,layoutBlocks:options.layoutBlocks});
  const layoutResult=assembly.layout || null;
  const preview=createPreviewRequest({documentSnapshot:createApplicationSnapshot(editorSession.application),layoutResult,template:{id:templateId,version:previewRequest.templateVersion}});
  return Object.freeze({previewRequest,assembly,layoutResult,preview});
}
