export const CV_EDITOR_ACCESSIBILITY_LIVEREGIONSTATE_VERSION='1.0.0';
export function liveRegionState(value, options={}){
 return Object.freeze({polite:Boolean(value?.polite),assertive:Boolean(value?.assertive)});
}