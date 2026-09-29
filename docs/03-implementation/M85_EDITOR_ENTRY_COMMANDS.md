# M85 — Editor Entry Commands

The editor command executor now implements update-entry and remove-entry. Updates merge supplied entry values without discarding unspecified values. Removal deletes only the targeted entry and reports a missing-entry error when the target does not exist.
