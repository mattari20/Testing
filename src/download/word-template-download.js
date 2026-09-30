import { createWordTemplateDownloadRequest } from '../templates/word-template-catalog.js';
import { createDownloadRequest, transitionDownload } from './download-delivery.js';

export const WORD_TEMPLATE_DOWNLOAD_VERSION = '1.0.0';

export function createWordTemplateDownload(templateId) {
  const template = createWordTemplateDownloadRequest(templateId);
  return createDownloadRequest({
    templateId: template.templateId,
    fileName: template.fileName,
    path: template.path
  });
}

export function markWordTemplatePreparing(request) {
  return transitionDownload(request, 'preparing');
}

export function markWordTemplateReady(request) {
  if (request.state !== 'preparing') throw new Error('Word template must be preparing before it becomes ready.');
  return transitionDownload(request, 'ready');
}

export function getWordTemplateDownloadHref(request) {
  if (!request || request.state !== 'ready') throw new Error('Word template is not ready for download.');
  return request.path;
}