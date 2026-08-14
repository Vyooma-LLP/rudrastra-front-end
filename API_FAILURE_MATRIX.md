# API_FAILURE_MATRIX

| Test Name | Path | Status | Response/Error |
|---|---|---|---|
| Unauth Products | `/api/products` | 200 | {"products":[{"id":"13a9a9e3-8d22-46be-ac7e-0e126621695a","sellerId":null,"title":"Pro Autopilot Controller","slug":null,"mpn":"Pixhawk 6X","sku":null,"description":"Pro Autopilot Controller with STM3 |
| Unauth Single Product | `/api/products/unknown-id` | 500 | {"error":"INTERNAL_ERROR","message":"Failed query: select \"id\", \"seller_id\", \"title\", \"slug\", \"mpn\", \"sku\", \"description\", \"price\", \"currency\", \"stock_qty\", \"category\", \"image_u |
| Unauth Cart GET | `/api/cart` | 401 | {"error":"Unauthorized"} |
| Unauth Cart POST | `/api/cart` | 401 | {"error":"Unauthorized"} |
| Unauth Quotes GET | `/api/quotes` | 401 | {"error":"Unauthorized"} |
| Unauth Quotes POST | `/api/quotes` | 401 | {"error":"Unauthorized"} |
| Unauth Admin Products | `/api/admin/products` | 405 | undefined |
| Unauth Admin Quotes | `/api/admin/quotes` | 401 | {"error":"Unauthorized"} |
| Unauth Ops Reconcile | `/ops/reconciliation` | 200 | <!DOCTYPE html><html lang="en" class="inter_fe8b9d92-module__LINzvG__variable syne_9cf912f6-module__gTZeBG__variable h-full antialiased"><head><meta charSet="utf-8"/><meta name="viewport" content="wid |
