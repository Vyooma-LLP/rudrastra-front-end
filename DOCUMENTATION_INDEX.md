# Rudrastra Documentation Index

## 1. Single Source of Truth Hierarchy

The Rudrastra backend architecture is strictly governed by the following documents in descending order of authority:

1. **[BACKEND_extras/historical/PRD.md](./BACKEND_extras/historical/PRD.md)**  
   *What* the backend must provide (Product Requirements & Behavior).
2. **[BACKEND_extras/historical/TRD.md](./BACKEND_extras/historical/TRD.md)**  
   *How* the backend must technically work (Technical Architecture & Invariants).
3. **[BACKEND_PLAN.md](./BACKEND_PLAN.md)**  
   *In what order* it will be implemented (Milestones & Sequence).
4. **[BACKEND_INSTRUCTIONS.md](./BACKEND_INSTRUCTIONS.md)**  
   *How* engineers/AI must execute the implementation (Execution Rules).

---

## 2. Supporting Architecture Documents

- **[ARCHITECTURE_DECISIONS.md](./ARCHITECTURE_DECISIONS.md)**: Ledger of why major architectural decisions were made.
- **[CONTRACT_INVENTORY.md](./CONTRACT_INVENTORY.md)**: Explicit definitions of the frontend/backend boundary.
- **[CONTRADICTION_REGISTER.md](./CONTRADICTION_REGISTER.md)**: Known contradictions and their resolutions.
- **[BACKEND_HANDOFF.md](./BACKEND_HANDOFF.md)**: Existing frontend/backend boundary summary.

---

## 3. Historical and Reference Material (Non-Authoritative)

> [!WARNING]
> `extras/` contains non-authoritative historical/reference material.  
> Do NOT use any document in `extras/` as the current implementation specification. If an invariant appears in `extras/` but not in the root authoritative documents, it is considered stale unless formally promoted.

- **[extras/historical/](./extras/historical/)**: Contains old iterations like `extras/historical/PRD.md`, `extras/historical/ARCHITECTURE.md`, `extras/historical/TRD.md`, and `extras/historical/ARCHITECTURE_FREEZE.md`.
- **[extras/architecture/](./extras/architecture/)**: Detailed legacy specs (e.g., `state_machine_spec.md`).
- **[extras/database/](./extras/database/)**: Database schema planning (`extras/database/SCHEMA_DESIGN.md`).
- **[extras/audits/](./extras/audits/)**: Operational matrices (e.g., `failure_control_spec.md`).
- **[extras/deployment/](./extras/deployment/)**: Deployment roadmaps (e.g., `PHASE_2_AWS_MIGRATION.md`).

---

## 4. Where to Start

If you are a new engineer or AI agent joining this project:
1. Start with **[BACKEND_extras/historical/PRD.md](./BACKEND_extras/historical/PRD.md)** to understand the business intent.
2. Read **[BACKEND_extras/historical/TRD.md](./BACKEND_extras/historical/TRD.md)** to understand the non-negotiable structural invariants.
3. Read **[BACKEND_INSTRUCTIONS.md](./BACKEND_INSTRUCTIONS.md)** to understand your execution constraints.
4. Pick up the next task from **[BACKEND_PLAN.md](./BACKEND_PLAN.md)**.
