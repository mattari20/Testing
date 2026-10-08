import { createMasterProfile, createTargetedCV, createDocumentSnapshot } from '../core/career-document-core.js';
import { migrateSkillsLanguagesProfile, migrateSkillsLanguagesTargetedCV } from '../core/skills-languages.js';
import { createDocumentLifecycle } from '../core/document-lifecycle.js';
import { assembleDocument } from '../assembly/document-assembly-engine.js';

export const APPLICATION_VERSION = '1.0.0';

export function createCVApplication(input = {}) {
  let profile;
  let targetedCV;
  if (input.masterProfile) {
    const suppliedTargetedCV = input.targetedCV || createTargetedCV({
      masterProfileId: input.masterProfile.id,
      ...(input.cvData || {})
    });
    const legacyRatings = suppliedTargetedCV?.configuration?.presentation?.ratings || {};
    const profileInput = JSON.parse(JSON.stringify(input.masterProfile));
    profileInput.__legacyPresentation = { ratings: legacyRatings };
    profile = migrateSkillsLanguagesProfile(profileInput);
    delete profile.__legacyPresentation;
    targetedCV = migrateSkillsLanguagesTargetedCV(suppliedTargetedCV, profile);
  } else {
    profile = createMasterProfile(input.profileData || {});
    targetedCV = createTargetedCV({
      masterProfileId: profile.id,
      ...(input.cvData || {})
    });
    targetedCV = migrateSkillsLanguagesTargetedCV(targetedCV, profile);
  }
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
