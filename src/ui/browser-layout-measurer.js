export const BROWSER_LAYOUT_MEASURER_VERSION='1.0.0';
export function createBrowserLayoutMeasurer(documentRef){if(!documentRef?.createElement)throw new Error('A browser document is required.');return Object.freeze({
 measureRoot(root){if(!root)throw new Error('Layout root is required.');const rect=root.getBoundingClientRect();return {width:rect.width,height:rect.height,scrollHeight:root.scrollHeight,scrollWidth:root.scrollWidth};},
 measureBlocks(root,selector='[data-v2-layout-block]'){return [...root.querySelectorAll(selector)].map((el,index)=>{const r=el.getBoundingClientRect();return {id:el.getAttribute('data-v2-layout-block')||String(index),measuredHeight:r.height,top:r.top,left:r.left,width:r.width,height:r.height};});}
});}
