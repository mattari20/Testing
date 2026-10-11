export const CV_EDITOR_ZOOM_CONTROLLER_VERSION='1.1.0';
export function createCVEditorZoomController(options={}){
  const container=options.container;
  if(!container)throw new Error('Zoom controller requires container.');
  let zoom=1;
  function apply(){
    container.setAttribute('data-preview-zoom',String(zoom));
    const stage=container.querySelector?.('[data-v2-preview-stage]');
    if(!stage)return;
    stage.dataset.previewZoom=String(zoom);
    const page=stage.querySelector?.('[data-v2-template-root]');
    if(!page)return;
    const fitScale=Math.min(1,Math.max(0.01,Number(stage.dataset.previewScale)||1));
    const naturalHeight=page.offsetHeight||1123;
    page.style.transformOrigin='top center';
    page.style.transform=`scale(${fitScale*zoom})`;
    stage.style.height=`${Math.ceil(naturalHeight*fitScale*zoom)}px`;
  }
  function set(value){zoom=Math.min(2,Math.max(.5,Number(value)||1));apply();return zoom;}
  return Object.freeze({version:CV_EDITOR_ZOOM_CONTROLLER_VERSION,get:()=>zoom,set,zoomIn:()=>set(zoom+.1),zoomOut:()=>set(zoom-.1),reset:()=>set(1),destroy(){}});
}