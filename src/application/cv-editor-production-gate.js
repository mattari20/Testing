import {listCVEditorProductionGroups} from './cv-editor-production-group-registry.js';
import {evaluateProductionContract} from './cv-editor-production-contract.js';
export const CV_EDITOR_PRODUCTION_GATE_VERSION='1.0.0';
export function createCVEditorProductionGate(options={}){
 const application=options.application||null,adapter=options.adapter||application?.adapter||null;
 const groups=options.groups||listCVEditorProductionGroups();
 function inspect(){
  const root={application,adapter,page:application?.page,coordinator:application?.coordinator,model:application?.model,composition:application?.composition,shell:application?.shell,acceptance:application?.acceptance,workflows:application?.workflows,realBrowser:application?.realBrowser,keyboard:application?.keyboard,announcer:application?.announcer,zoom:application?.zoom};
  const contract=evaluateProductionContract(root,groups);
  return Object.freeze({version:CV_EDITOR_PRODUCTION_GATE_VERSION,contract,ready:contract.valid});
 }
 function assertReady(){const report=inspect();if(!report.ready)throw new Error('CV Builder production gate failed: '+report.contract.failures.map(item=>item.target).join(', '));return report;}
 return Object.freeze({version:CV_EDITOR_PRODUCTION_GATE_VERSION,groups,inspect,assertReady});
}
