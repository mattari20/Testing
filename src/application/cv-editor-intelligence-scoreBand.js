export const CV_EDITOR_INTELLIGENCE_SCOREBAND_VERSION='1.0.0';
export function scoreBand(value, options={}){
 { const n=Number(value)||0; return n>=80?'high':n>=60?'medium':'low'; }
}