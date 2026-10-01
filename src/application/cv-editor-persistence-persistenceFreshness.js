export const CV_EDITOR_PERSISTENCE_PERSISTENCEFRESHNESS_VERSION='1.0.0';
export function persistenceFreshness(value, options={}){
 return Object.freeze({updatedAt:value?.updatedAt||null,fresh:Boolean(value?.updatedAt)});
}