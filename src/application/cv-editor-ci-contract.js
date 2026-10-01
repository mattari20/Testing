export const CV_EDITOR_CI_CONTRACT_VERSION='1.0.0';
export const REQUIRED_CI_COMMANDS=Object.freeze(['test:m13562-m21561','test:production-integration','test:editor-production']);
export function validateCIContract(packageJson){
 const scripts=packageJson?.scripts||{};
 const missing=REQUIRED_CI_COMMANDS.filter(name=>typeof scripts[name]!=='string');
 return Object.freeze({version:CV_EDITOR_CI_CONTRACT_VERSION,valid:missing.length===0,missing,commands:REQUIRED_CI_COMMANDS});
}
