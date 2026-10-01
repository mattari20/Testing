export const CV_EDITOR_PERSISTENCE_RECOVERYKEY_VERSION='1.0.0';
export function recoveryKey(value, options={}){
 return 'recovery:'+String(value||'');
}