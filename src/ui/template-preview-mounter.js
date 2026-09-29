import { renderNativeV2Template } from '../render/native-v2-template-renderer.js';

export const TEMPLATE_PREVIEW_MOUNTER_VERSION = '1.0.0';

export function mountTemplatePreview(root, templateSource, documentData, options = {}) {
  if (!root) throw new Error('Preview root is required.');
  if (!templateSource) throw new Error('Template source is required.');
  root.replaceChildren();
  const host = root.ownerDocument.createElement('div');
  host.dataset.v2PreviewHost = 'true';
  root.appendChild(host);
  const rendered = renderNativeV2Template(templateSource, documentData, options);
  if (rendered?.html) host.innerHTML = rendered.html;
  return Object.freeze({ version: TEMPLATE_PREVIEW_MOUNTER_VERSION, rendered, host });
}
