import {createCVEditorBrowserPage} from './cv-editor-browser-page.js';
import {createCVEditorCoordinator} from './cv-editor-coordinator.js';
import {createCVEditorKeyboardController} from './cv-editor-keyboard-controller.js';
import {createCVEditorAccessibilityAnnouncer} from './cv-editor-accessibility-announcer.js';
import {createCVEditorZoomController} from './cv-editor-zoom-controller.js';
import {createCVEditorBrowserComposition} from './cv-editor-browser-composition.js';
import {createCVEditorBrowserModel} from './cv-editor-browser-model.js';
import {createCVEditorIntegratedShell} from './cv-editor-integrated-shell.js';
import {createCVEditorUXAcceptance} from './cv-editor-ux-acceptance.js';
import {createCVEditorWorkflowSurface} from './cv-editor-workflow-surface.js';
import {createCVEditorRealBrowserSurface} from './cv-editor-real-browser-surface.js';
export const CV_EDITOR_BROWSER_APPLICATION_VERSION='1.5.0';
export function createCVEditorBrowserApplication(options={}){
 const coordinator=createCVEditorCoordinator(options);
 const page=createCVEditorBrowserPage({document:options.document,mount:options.mount,root:options.root,title:options.title,adapter:options.adapter});
 const keyboard=options.document?createCVEditorKeyboardController({document:options.document,adapter:options.adapter,page}):null;
 const announcer=options.document?createCVEditorAccessibilityAnnouncer({document:options.document}):null;
 const zoom=options.document?createCVEditorZoomController({container:page.shell.preview}):null;
 const composition=options.adapter?createCVEditorBrowserComposition({application:{page,start:()=>page.mount(),stop:()=>{}},adapter:options.adapter,validation:coordinator.validation}):null;
 const model=options.adapter?createCVEditorBrowserModel({adapter:options.adapter,readiness:composition?.readiness}):null;
 const shell=createCVEditorIntegratedShell({page});
 const acceptance=createCVEditorUXAcceptance({application:{page,model,composition}});
 const workflows=options.adapter?createCVEditorWorkflowSurface({adapter:options.adapter,document:options.document,root:page.shell.root,documentManager:options.documentManager,saveController:options.saveController,exportController:options.exportController}):null;
 const realBrowser=options.adapter?createCVEditorRealBrowserSurface({application:{page,workflows,start:()=>page.mount()},adapter:options.adapter}):null;
 let destroyed=false;
 function start(){if(destroyed)return null;page.mount();const state=coordinator.refresh();composition?.start();return state;}
 function stop(){if(destroyed)return;destroyed=true;composition?.stop();keyboard?.destroy();announcer?.destroy();zoom?.destroy();shell.destroy();page.destroy();coordinator.destroy();}
 return Object.freeze({version:CV_EDITOR_BROWSER_APPLICATION_VERSION,coordinator,page,keyboard,announcer,zoom,composition,model,shell,acceptance,workflows,realBrowser,start,stop});
}