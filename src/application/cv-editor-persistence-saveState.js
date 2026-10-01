export const CV_EDITOR_PERSISTENCE_SAVESTATE_VERSION='1.0.0';
export function saveState(value, options={}){
 return Object.freeze({workspaceId:value?.workspaceId||null,updatedAt:value?.updatedAt||null});
}