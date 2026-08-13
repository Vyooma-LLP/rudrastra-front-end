import fs from 'fs';
import path from 'path';

// Read existing file
let content = fs.readFileSync('FEATURE_INVENTORY.md', 'utf-8');

// Find the matrix and replace it
const matrixTemplate = `
## 12. Feature Matrix

| Feature | MVP | Normal User | Owner Preview | Admin | Emergency Kill | Current Implementation |
|---------|-----|-------------|---------------|-------|----------------|-------------------------|
| Authentication | YES | Available | Available | Available | - | REAL |
| Product Catalog | YES | Available | Available | Available | Overrides | REAL |
| Search/Filters | YES | Available | Available | Available | Overrides | UI-ONLY |
| Cart | YES | Available | Available | Available | Overrides | REAL |
| Checkout | YES | Available | Available | Available | Overrides | REAL |
| Order History | YES | Available | Available | Available | Overrides | REAL |
| Control Center | YES | Hidden | Available | Available | - | REAL (Flags) / UI (Dashboard) |
| Admin Catalog Mgmt | YES | Hidden | Available | Available | Overrides | REAL |
| Basic Product Specs | YES | Available | Available | Available | Overrides | MOCK |
| RFQ | NO | Coming Soon | Available | Coming Soon | Overrides | MOCK |
| BOM Upload & Parsing | NO | Coming Soon | Available | Coming Soon | Overrides | MOCK |
| Compatibility Engine | NO | Coming Soon | Available | Coming Soon | Overrides | MOCK |
| Multi-Seller Offers | NO | Coming Soon | Available | Coming Soon | Overrides | MOCK |
| Seller Dashboard | NO | Coming Soon | Available | Coming Soon | Overrides | MOCK |
| B2B Procurement | NO | Coming Soon | Available | Coming Soon | Overrides | UI-ONLY |
| Finance / Ledger | NO | Coming Soon | Available | Coming Soon | Overrides | UI-ONLY |
| Warranties / RMA | NO | Coming Soon | Available | Coming Soon | Overrides | UI-ONLY |
| Tickets / Support | NO | Coming Soon | Available | Coming Soon | Overrides | UI-ONLY |
| Engineering Search | NO | Coming Soon | Available | Coming Soon | Overrides | MOCK |
| Engineering Compare | NO | Coming Soon | Available | Coming Soon | Overrides | UI-ONLY |
`;

content = content.replace(/## 12\. Product Owner Decision Matrix[\s\S]*/, matrixTemplate);

fs.writeFileSync('FEATURE_INVENTORY.md', content);
