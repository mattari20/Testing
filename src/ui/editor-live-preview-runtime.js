import { createApplicationSnapshot } from '../application/cv-application.js';
import { getNativeV2Template } from '../templates/v2-native-template-catalog.js';
import { loadNativeTemplateSource } from '../templates/native-template-source-loader.js';
import { renderNativeTemplateSource, createNativeRenderDefinition } from '../render/native-v2-template-renderer.js';
import { bindPreviewInlineEditing } from './editor-preview-inline-controller.js';

export const EDITOR_LIVE_PREVIEW_RUNTIME_VERSION = '1.0.0';

const PREVIEW_COMMANDS = new Set([
  'set-identity','set-field','update-entry','add-entry','remove-entry','duplicate-entry',
  'add-section','remove-section','set-section-title','add-field','remove-field',
  'set-field-definition','set-visibility','reorder','set-template','set-variant',
  'upload-asset','remove-asset','undo','redo'
]);

export function createEditorLivePreviewRuntime(surface, root, options = {}) {
  if (!surface || typeof surface.getState !== 'function' || typeof surface.subscribe !== 'function') {
    throw new Error('A valid editor surface is required.');
  }
  if (!root) throw new Error('Preview root is required.');

  const fetcher = options.fetcher || globalThis.fetch;
  if (typeof fetcher !== 'function') throw new Error('A fetch implementation is required.');

  let revision = 0;
  let inlineBinding = null;
  let resizeObserver = null;
  let destroyed = false;

  function fitPreviewPage(stage, page) {
    if (!stage || !page) return;
    const naturalWidth = page.offsetWidth || page.getBoundingClientRect().width || 794;
    const naturalHeight = page.offsetHeight || page.getBoundingClientRect().height || 1123;
    const availableWidth = Math.max(1, stage.clientWidth);
    const scale = Math.min(1, availableWidth / naturalWidth);
    page.style.transformOrigin = 'top center';
    page.style.transform = `scale(${scale})`;
    stage.style.height = `${Math.ceil(naturalHeight * scale)}px`;
    stage.dataset.previewScale = scale.toFixed(4);
  }

  function createPreviewStage(page) {
    const stage = root.ownerDocument.createElement('div');
    stage.className = 'v2-preview-stage';
    stage.setAttribute('data-v2-preview-stage', 'true');
    stage.appendChild(page);
    return stage;
  }

  async function refresh() {
    const token = ++revision;
    const session = surface.getState().session;
    const targetedCV = session?.application?.targetedCV;
    const templateId = options.templateId || targetedCV?.configuration?.template?.id;
    if (!templateId) throw new Error('A template must be selected before preview.');

    const template = getNativeV2Template(templateId);
    if (!template) throw new Error('Native V2 template not found: ' + templateId);

    const descriptor = await loadNativeTemplateSource(templateId, { fetcher });
    if (destroyed || token !== revision) return { stale: true };

    const snapshot = createApplicationSnapshot(session.application);
    const definition = createNativeRenderDefinition({
      id: descriptor.id,
      sourceHtml: descriptor.sourceHtml,
      templateVersion: descriptor.version,
      metadata: template
    });
    const rendered = renderNativeTemplateSource(definition, snapshot, root.ownerDocument);
    if (destroyed || token !== revision) return { stale: true };

    inlineBinding?.destroy();
    resizeObserver?.disconnect();

    const stage = createPreviewStage(rendered.root);
    root.replaceChildren(stage);

    const fit = () => fitPreviewPage(stage, rendered.root);
    requestAnimationFrame(fit);

    if (typeof ResizeObserver === 'function') {
      resizeObserver = new ResizeObserver(fit);
      resizeObserver.observe(stage);
    } else {
      resizeObserver = null;
    }

    inlineBinding = bindPreviewInlineEditing(root, surface);

    return Object.freeze({
      version: EDITOR_LIVE_PREVIEW_RUNTIME_VERSION,
      stale: false,
      templateId,
      templateVersion: template.version,
      rendered
    });
  }

  const unsubscribe = surface.subscribe((state, command) => {
    if (!command || PREVIEW_COMMANDS.has(command.type)) {
      refresh().catch(() => {});
    }
  });

  return Object.freeze({
    version: EDITOR_LIVE_PREVIEW_RUNTIME_VERSION,
    refresh,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      revision += 1;
      inlineBinding?.destroy();
      inlineBinding = null;
      resizeObserver?.disconnect();
      resizeObserver = null;
      unsubscribe();
    }
  });
}
