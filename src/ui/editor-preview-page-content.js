export const EDITOR_PREVIEW_PAGE_CONTENT_VERSION='1.0.0';
export function mountPreviewPageContent(pageElement,contentHtml=''){
  if(!pageElement)throw new Error('Preview page element is required.');
  const documentRef=pageElement.ownerDocument;
  const host=documentRef.createElement('div');
  host.dataset.v2PageContent='true';
  host.className='v2-preview-page-content';
  host.innerHTML=String(contentHtml);
  pageElement.replaceChildren(host);
  return Object.freeze({version:EDITOR_PREVIEW_PAGE_CONTENT_VERSION,host});
}
