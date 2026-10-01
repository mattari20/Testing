# M428–M437 — Editor Runtime Persistence Integration

## Objective

Connect the M418–M427 persistence and recovery boundary to the real V2 editor runtime without changing the existing default editor behavior.

## Delivered

- Editor runtime accepts an injected persistence adapter or storage object.
- Persistence remains opt-in; existing mounts continue to work unchanged when no persistence option is supplied.
- Optional automatic recovery runs before the first editor render.
- Runtime exposes the recovery controller for explicit flush, recovery and clear operations.
- Runtime flushes pending dirty state during destruction so lifecycle-sensitive changes are not silently lost.
- Restore is treated as a render-triggering editor event and stale undo/redo history remains cleared by the existing recovery boundary.
- Repository validation covers runtime persistence wiring and automatic recovery.

## Safety boundaries

- No credential, provider secret or production configuration is persisted.
- No storage technology is required by the editor runtime contract; callers may inject the adapter or storage implementation.
- V1 production remains untouched.
- Persistence remains disabled unless explicitly configured.

## Acceptance

1. Existing editor runtime still mounts without persistence configuration.
2. Injected persistence can be created and exposed by the runtime.
3. Dirty editor changes can be flushed through the runtime.
4. A persisted session can be recovered before initial render.
5. Recovery leaves undo/redo history empty.
6. Runtime destruction flushes pending persistence and cleans up the recovery controller.
