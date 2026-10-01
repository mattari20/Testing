export const CV_EDITOR_INTELLIGENCE_MATCHPERCENTAGE_VERSION='1.0.0';
export function matchPercentage(value, options={}){
 return Math.max(0,Math.min(100,Number(value)||0));
}