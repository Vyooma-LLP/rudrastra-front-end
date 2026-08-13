# CONTRACT_INVENTORY.md

This document serves as the inventory of all existing frontend commands and queries that the backend MUST implement. 
*(To be fully populated by the Backend Engineer during Phase 0: Forensic Analysis)*

## 1. Commerce Contracts
| Contract | Operation | Input | Output | Backend endpoint | DB entities | Auth | Capability | Idempotency |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `AddToCartCommand` | Mutation | `productId`, `quantity` | `CartState` | `/api/cart/add` | `carts`, `cart_items` | Required | `commerce.cart` | Required |
| `CheckoutCommand` | Mutation | `cartId`, `addressId` | `Order` | `/api/checkout` | `orders`, `inventory` | Required | `commerce.checkout`| Required |

## 2. Identity Contracts
| Contract | Operation | Input | Output | Backend endpoint | DB entities | Auth | Capability | Idempotency |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GetSessionQuery` | Query | `None` | `UserSession` | `/api/auth/session`| `users`, `orgs` | N/A | Core | N/A |

## 3. Capability Contracts
| Contract | Operation | Input | Output | Backend endpoint | DB entities | Auth | Capability | Idempotency |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `EvaluateCapability` | Query | `featureKey` | `CapabilityDecision`| `/api/capabilities/eval`| `capabilities` | Required | Core | N/A |

*(Inventory to be continued...)*
