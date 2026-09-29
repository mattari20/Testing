# M84 — Editor Runtime Rebinding

The V2 editor runtime now owns DOM bindings for its generated form. Before each render it destroys previous listeners, replaces generated controls, and binds the new controls. This keeps regenerated fields editable and prevents duplicate listeners.
