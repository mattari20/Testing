export const CV_EDITOR_ACCESSIBILITY_CONTROLSTATE_VERSION='1.0.0';
export function controlState(value, options={}){
 return Object.freeze({disabled:Boolean(value?.disabled),expanded:Boolean(value?.expanded)});
}