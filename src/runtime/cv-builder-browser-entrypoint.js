import {createCVEditorBrowserApplication} from '../application/cv-editor-browser-application.js';
export const CV_BUILDER_BROWSER_ENTRYPOINT_VERSION='1.0.0';
export function createCVBuilderBrowserEntrypoint(options={}){
 const application=createCVEditorBrowserApplication(options);
 const start=()=>application.start();
 const stop=()=>application.stop();
 return Object.freeze({version:CV_BUILDER_BROWSER_ENTRYPOINT_VERSION,application,start,stop});
}