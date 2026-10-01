export const CV_EDITOR_EXPORT_EXPORTREQUEST_VERSION='1.0.0';
export function exportRequest(value, options={}){
 return Object.freeze({format:value||'pdf',metadata:options.metadata||{}});
}