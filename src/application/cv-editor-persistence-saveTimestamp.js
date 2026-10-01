export const CV_EDITOR_PERSISTENCE_SAVETIMESTAMP_VERSION='1.0.0';
export function saveTimestamp(value, options={}){
 return value||new Date().toISOString();
}