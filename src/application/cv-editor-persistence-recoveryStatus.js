export const CV_EDITOR_PERSISTENCE_RECOVERYSTATUS_VERSION='1.0.0';
export function recoveryStatus(value, options={}){
 return String(value?.status||'none');
}