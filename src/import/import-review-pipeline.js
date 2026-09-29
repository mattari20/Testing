import { detectSource, createImportCandidate, acceptImportCandidate, partiallyAcceptImportCandidate, migrateV1ToV2 } from './import-migration-engine.js';

export const IMPORT_REVIEW_VERSION = '1.0.0';

export function createImportReview(input = {}) {
  const detected = detectSource(input);
  const candidate = createImportCandidate(input);
  return Object.freeze({
    version: IMPORT_REVIEW_VERSION,
    candidate,
    detection: detected,
    review: {
      status: 'needs-review',
      requiresHumanAcceptance: true,
      autoApply: false
    }
  });
}

export function prepareStructuredImport(input = {}) {
  const review = createImportReview({ ...input, data: input.data || {} });
  return Object.freeze({
    ...review,
    candidate: {
      ...review.candidate,
      extractedData: input.data || {}
    }
  });
}

export function prepareV1MigrationReview(input = {}) {
  const migration = migrateV1ToV2(input);
  return Object.freeze({
    version: IMPORT_REVIEW_VERSION,
    detection: detectSource(input),
    migration,
    review: {
      status: migration.report.completed ? 'ready-for-acceptance' : 'blocked',
      requiresHumanAcceptance: true,
      autoApply: false
    }
  });
}

export function acceptReview(review, acceptedData = null) {
  if (!review?.candidate) throw new Error('Import review candidate is required.');
  return acceptImportCandidate(review.candidate, acceptedData || review.candidate.extractedData);
}

export function partialAcceptReview(review, acceptedData = {}, rejected = []) {
  if (!review?.candidate) throw new Error('Import review candidate is required.');
  return partiallyAcceptImportCandidate(review.candidate, acceptedData, rejected);
}

export function markReviewRejected(review, reason = 'USER_REJECTED') {
  if (!review?.candidate) throw new Error('Import review candidate is required.');
  return {
    ...review.candidate,
    reviewState: 'rejected',
    rejectionReason: String(reason),
    rejectedAt: new Date().toISOString()
  };
}
