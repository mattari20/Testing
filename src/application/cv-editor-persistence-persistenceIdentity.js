export const CV_EDITOR_PERSISTENCE_PERSISTENCEIDENTITY_VERSION='1.0.0';
export function persistenceIdentity(value, options={}){
 return Object.freeze({workspaceId:value?.workspaceId||null,documentId:value?.documentId||null});
}