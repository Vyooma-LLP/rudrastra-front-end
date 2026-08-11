# CONTRADICTION_REGISTER.md

This document serves as the ledger for any contradictions discovered during the Phase 0 Forensic Analysis. No contradiction may be silently ignored.

| ID | Source | Contradiction | Risk | Decision | Reason | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 001 | *Example* | *Frontend `CartAdapter` sends total to backend; TRD says backend is authoritative.* | *High: Client-side manipulation of prices.* | *Modify `CartAdapter` to drop total; Backend computes from DB.* | *TRD absolute rule: Money.* | *Pending* |

*(To be populated by the Backend Engineer during Phase 0)*
