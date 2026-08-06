# Rudrastra Canonical State-Machine Contract

**Status: FROZEN**

This document defines the structural contract for all state machines within the Rudrastra architecture. Because so much of the system depends on the correct lifecycles of Orders, Payments, Inventory, Refunds, Shipments, Returns, Payouts, Tickets, Incidents, and Changes, all implementations must adhere to this uniform contract.

## 1. State Mutation Rule
> **No application code may directly mutate an authoritative state-machine state field.**

Arbitrary status updates (e.g., `db.update(orders).set({status: 'DELIVERED'})`) are explicitly **prohibited**. Only the authoritative state-machine transition API may mutate the state.

The architectural rule for commands is:
`Command -> Domain Transition -> Validate Preconditions -> Transition -> Domain Effects -> Persist -> Emit Event`

CI/Static analysis enforcement MUST be employed to ensure direct CRUD status mutations are rejected.

## 2. The Standard State-Machine Definition
Every state machine in Rudrastra MUST explicitly define the following elements:

1. **Valid States**: The exhaustive list of allowable statuses for the entity.
2. **Valid Transitions**: The explicit edges connecting states (e.g., `PENDING -> AUTHORIZED`, `AUTHORIZED -> CAPTURED`). Transitions like `REFUNDED -> CAPTURED` are invalid unless a formal compensating transition exists.
3. **Transition Actor**: The identity/capability required to trigger the transition (e.g., `SYSTEM_WEBHOOK`, `OPS_ADMIN`, `CUSTOMER`).
4. **Preconditions**: The business logic checks that must pass before the transition is allowed (e.g., `inventory must be reserved`, `ledger balance must be sufficient`).
5. **Side Effects**: Operations that must occur atomically with the transition (e.g., `create outbox event`, `generate ledger entry`).
6. **Idempotency Behavior**: How the system responds if the same transition command is received twice (e.g., `noop and return 200 OK`).
7. **Failure Behavior**: The fallback or compensation logic if the transition fails.
8. **Audit Event**: The specific, immutable audit record that must be generated.
9. **Recovery Path**: How to resolve states that get stuck or orphaned due to external system failure.

## 3. Mandatory State Machine Testing
Every critical state machine MUST include automated tests for all of the following:
* Valid transition
* Invalid transition
* Repeated transition (idempotency)
* Concurrent transition
* Stale command execution
* Failed side effect
* Retry semantics
* Recovery semantics
* Authorization enforcement
* Audit event generation

## 4. Implementation Contract
Every application specification (e.g., `docs/applications/payments.md`, `docs/applications/orders.md`) must instantiate this state-machine definition for its domain entities. Application specifications may define the specific states and transitions, but they may not weaken or bypass this structural contract. Every state machine must have exactly one authoritative domain owner.
