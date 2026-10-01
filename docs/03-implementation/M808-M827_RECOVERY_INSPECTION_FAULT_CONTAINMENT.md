# M808–M827 — Recovery Inspection Fault Containment

Recovery inspection now distinguishes transient inspection errors from invalid persisted data.

A recoverable adapter/storage error is exposed as `recoveryStatus: error` with `recoveryInspectionRetryable: true`. The cached error is not retried on every state read.

Invalid persistence remains non-retryable because it requires an explicit recovery decision such as clear/repair rather than blind repeated reads.

`refreshRecovery()` is the explicit retry boundary for transient failures. Clear resets the retryability marker to a ready missing state.

Validation: `tests/m808-m827/recovery-inspection-faults.test.js` and package script `test:m808-m827`.

No V1 production runtime or asset was changed.