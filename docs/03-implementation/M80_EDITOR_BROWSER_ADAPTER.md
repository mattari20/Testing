# M80 — Editor Browser Adapter

M80 adds a real-browser boundary for the V2 editor.

The adapter intentionally accepts an injected browser page rather than selecting a browser technology inside the editor core. It can mount, inspect, and mutate V2 editor fields through browser DOM events.