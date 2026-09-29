# M79 — V2 Editor Runtime Validation Boundary

M79 records the first V2 runtime isolation gate.

The editor runtime must:
- use V2 application/editor boundaries;
- remain independent of V1 runtime files;
- remain framework-neutral;
- preserve canonical data ownership;
- expose only presentation-safe state.

Actual browser execution remains a separate evidence task.