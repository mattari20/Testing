export const CV_EDITOR_PERSISTENCE_SNAPSHOTKEY_VERSION='1.0.0';
export function snapshotKey(value, options={}){
 return 'snapshot:'+String(value||'');
}