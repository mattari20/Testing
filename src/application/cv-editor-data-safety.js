export const CV_EDITOR_DATA_SAFETY_VERSION='1.0.0';
export function sanitizeClientState(value){
 if(value==null||typeof value!=='object')return value;
 const clone=JSON.parse(JSON.stringify(value));
 delete clone.password;delete clone.passwordHash;delete clone.secret;delete clone.accessToken;delete clone.refreshToken;
 return clone;
}
export function createDataSafetyReport(value){const sanitized=sanitizeClientState(value);return Object.freeze({version:CV_EDITOR_DATA_SAFETY_VERSION,sanitized,removedSecrets:JSON.stringify(sanitized)!==JSON.stringify(value)});}
