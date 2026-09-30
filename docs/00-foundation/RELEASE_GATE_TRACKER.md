# Release Gate Tracker — CV Builder V2

| Gate | Status | Evidence currently available | Remaining action |
|---|---|---|---|
| R1 V1 source/asset closure | CONDITIONAL | Seven V1 sources verified on main; missing T01 ATS/Simple recorded | Recover sources or approve replacement/retirement; verify historical assets |
| R2 Security closure | CONDITIONAL | Current-main indicator scan clean | Rotate/revoke production credentials; verify repository history |
| R3 Golden Baseline package | OPEN | Comparison contracts and browser harnesses exist | Produce authoritative fixtures and observed V1/V2 output evidence |
| R4 Browser CI | OPEN | Workflow configured; integrated test registered | Observe successful GitHub Actions run and inspect artifacts |
| R5 Pagination/fragmentation acceptance | OPEN | Contracts/tests/harness exist | Confirm real browser behavior and acceptance evidence |
| R6 Production integration | OPEN | V2 editor/application architecture exists | Verify final production wiring and V2-only path |
| R7 V1 retirement | OPEN | Governance rule defined | Retire temporary V1 runtime/adapters after acceptance |
| R8 Final release | BLOCKED BY ABOVE | Release-readiness document exists | Close all gates and record final acceptance |

## Governance

- OPEN means work/evidence has not yet been established.
- CONDITIONAL means repository work is present but an external or authoritative dependency remains.
- PASS means evidence has actually been observed.
- No gate is marked PASS merely because code, tests, or workflow configuration exists.
