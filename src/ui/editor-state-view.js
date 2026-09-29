export const EDITOR_STATE_VIEW_VERSION = '1.0.0';

export function createEditorStateView(surface) {
  if (!surface) throw new Error('Editor surface is required.');
  return Object.freeze({
    read() {
      const state = surface.getState();
      return {
        dirty: Boolean(state.session.dirty),
        lastCommand: state.session.lastCommand || null,
        masterProfileId: state.session.application.masterProfile.id,
        targetedCVId: state.session.application.targetedCV.id,
        templateId: state.session.application.targetedCV.configuration?.template?.id || null
      };
    }
  });
}
