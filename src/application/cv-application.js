import { createMasterProfile, createTargetedCV, createDocumentSnapshot } from '../core/career-document-core.js';
import { createDocumentLifecycle } from '../core/document-lifecycle.js';
import { assembleDocument } from '../assembly/document-assembly-engine.js';

export const APPLICATION_VERSION = '1.0.0';

export function createCVApplication(input = {}) {
  const profile = input.masterProfile || createMasterProfile(input.profileData || {});
  const targetedCV = input.targetedCV || createTargetedCV({
    masterProfileId: profile.id,
    ...(input.cvData || {})
  });
  const lifecycle = createDocumentLifecycle({
    masterProfileId: profile.id,
    targetedCVId: targetedCV.id
  });
  return Object.freeze({
    version: APPLICATION_VERSION,
    masterProfile: profile,
    targetedCV,
    lifecycle
  });
}

export function createApplicationSnapshot(application) {
  if (!application?.masterProfile || !application?.targetedCV) {
    throw new Error('Application requires a master profile and targeted CV.');
  }
  return createDocumentSnapshot(application.masterProfile, application.targetedCV);
}

export function assembleApplicationDocument(application, options = {}) {
  const snapshot = createApplicationSnapshot(application);
  return assembleDocument({
    masterProfile: application.masterProfile,
    targetedCV: application.targetedCV,
    documentSnapshot: snapshot,
    ...options
  });
}
