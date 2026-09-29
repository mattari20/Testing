export const EDITOR_LIVE_PREVIEW_VERSION = '1.0.0';

export function createEditorLivePreview(surface, renderPreview, mountPreview) {
  if (!surface || typeof renderPreview !== 'function' || typeof mountPreview !== 'function') {
    throw new Error('Surface, renderPreview and mountPreview are required.');
  }
  let revision = 0;
  return Object.freeze({
    async refresh(options = {}) {
      revision += 1;
      const token = revision;
      const preview = await renderPreview(surface.getState().session, options);
      if (token !== revision) return { stale: true };
      mountPreview(preview);
      return { stale: false, preview };
    },
    invalidate() { revision += 1; }
  });
}
