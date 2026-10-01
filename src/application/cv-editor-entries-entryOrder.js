export const CV_EDITOR_ENTRIES_ENTRYORDER_VERSION='1.0.0';
export function entryOrder(value, options={}){
 return Array.isArray(value)?value.map((item,index)=>({...item,order:index})):[];
}