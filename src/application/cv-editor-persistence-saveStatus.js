export const CV_EDITOR_PERSISTENCE_SAVESTATUS_VERSION='1.0.0';
export function saveStatus(value, options={}){
 return String(value?.status||'unsaved');
}