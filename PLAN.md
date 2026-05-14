# SSS Inventory — Advanced Feature Plan

## Current State Summary

Single-file PWA (`index.html`) with Firebase Firestore real-time sync, App Check, a hardcoded 52-part BOM for "SSC" units, and these working features: inventory table with stock controls, build-1-SSC, build history, purchase orders, barcode/QR scan, and CSV import. Authentication is wired up but **intentionally disabled** (`doSignIn`/`doRegister` show a toast instead of calling Firebase Auth).

---

## Feature Details

### 1. Re-enable & Harden Authentication *(High Priority)*
- Restore actual Firebase Auth email/password sign-in and registration calls
- Add **password reset** (Firebase `sendPasswordResetEmail`)
- Store user roles in Firestore `/users/{uid}` document (`role: "admin" | "viewer"`)
- On login, fetch the user's role and conditionally show/hide all `admin-only` UI elements
- Tighten **Firestore Security Rules** to enforce roles server-side (viewers: read-only; admins: full write)

### 2. Inline Part Edit & Delete
- Add an **Edit** button per row (admin only) that opens a pre-filled modal to update: name, company, part number, min qty per SSC, unit price, and mode
- Add a **Delete** button (with confirmation) to remove parts from Firestore
- Currently no edit path exists; stock can only be changed via the +/- control

### 3. Multi-Unit Build Planning
- Replace "Build 1 SSC" with a **Build N SSC** modal — enter a quantity, preview which parts will drop below threshold
- Add a **Build Forecast** panel: show how many additional SSCs are possible if all pending/ordered POs are received
- "What-if" simulation: show required PO quantities to support a target build count

### 4. Automated Reorder & Smart PO Generation
- **One-click "Reorder All Low"** button: auto-create POs for every out/low part at the quantity needed to support a configurable target build count (e.g., 5 SSCs)
- Per-part configurable reorder point and reorder quantity (stored in Firestore)
- Show a suggested order quantity on the PO creation form based on current deficit

### 5. Audit Log / Full Activity Trail
- Currently only build events are logged; extend to all stock changes
- Record every `updateStock` call with: user email, timestamp, old value, new value, reason (optional free-text)
- Firestore collection: `auditLog/{docId}` with part reference
- Audit Log modal with per-part filtering and date range

### 6. Stock Adjustment Reasons
- When manually changing stock (via +/- or direct input), optionally prompt for a reason (dropdown: "Received shipment", "Used in build", "Damaged/Scrap", "Audit correction", "Other")
- Reason is saved with the audit log entry

### 7. Analytics Dashboard Tab
- Add a **Reports** tab or modal showing:
  - Build rate over time (bar chart — last 30 days)
  - Top 10 most-consumed parts (by total qty used in builds)
  - Inventory value trend (line chart over time, tracked in Firestore snapshots)
  - Vendor spend breakdown (pie chart by company)
- Use a lightweight charting library (Chart.js via CDN)

### 8. Export Features
- **Export CSV**: current filtered inventory view → downloadable CSV (client-side, no server needed)
- **Export Build History**: CSV with timestamp, user, parts used
- **Export Purchase Orders**: CSV filtered by status
- **Print view**: print-friendly stylesheet that hides nav/toolbar and formats table cleanly

### 9. Part Label / QR Code Generation
- Per-part **"Print Label"** action that generates a printable QR code label (part number encoded) with part name and company
- "Print All Labels" option to generate a label sheet
- Use a QR code generation library (qrcode.js via CDN)

### 10. Enhanced Barcode Scan Workflow
- After scanning and matching a part, show inline stock +/− buttons directly in the scan modal — no need to close and find the row
- "Quick Receive" mode: scan a part and immediately add a quantity (useful at receiving dock)
- Support scanning to launch the PO creation form for that part

### 11. Vendor / Supplier Management
- Dedicated Firestore collection: `vendors/{id}` with name, contact, website, lead time (days)
- Link each part to a vendor record (replacing free-text `company` field)
- Display lead time on low-stock/out rows as a hint
- Vendor list modal (admin) to add/edit vendors

### 12. Multi-Product BOM Support
- Abstract the hardcoded "SSC" product to a `products` Firestore collection
- Each product has its own BOM (parts + min qty per build)
- Build capacity KPI and Build button become product-aware
- Useful when managing parts shared across multiple product lines

### 13. Push / Email Notifications
- **Browser push notifications** (using Firebase Cloud Messaging) when any part goes out of stock, triggered by a Cloud Function on Firestore write
- **Daily digest email** (Cloud Function + SendGrid/Firebase Extensions) listing all low/out items
- Notification preferences per user (opt-in)

### 14. Offline-First PWA (Service Worker)
- Add a Service Worker (`sw.js`) with a cache-first strategy for the app shell
- Queue Firestore writes (stock updates) in IndexedDB when offline; replay on reconnect
- Show an "Offline" indicator in the header sync dot
- Currently only `manifest.json` exists; no service worker is present

### 15. User Management UI (Admin)
- List all registered users (read from Firestore `/users` collection)
- Admin can promote/demote roles and deactivate accounts
- Deactivated users' Firestore reads/writes blocked via Security Rules

### 16. Part Images
- Allow uploading a part photo via Firebase Storage (image stored at `parts/{id}/image`)
- Display thumbnail in the inventory table and full image in a part detail modal
- Useful for visual identification in warehouse environments

### 17. Code Architecture Modernization
- Split the single 990-line file into:
  - `index.html` (skeleton)
  - `styles.css`
  - `app.js` (split into modules: `auth.js`, `inventory.js`, `purchaseOrders.js`, `scanner.js`, `importExport.js`)
- Adopt a simple build tool (Vite) for bundling, tree-shaking, and local dev server
- Add ESLint for code quality

---

## Priority Roadmap

| Phase | Features |
|-------|----------|
| **Phase 1** — Foundation | Re-enable Auth + Firestore Security Rules · Inline Edit/Delete · Stock Adjustment Reasons · Audit Log |
| **Phase 2** — Operations | Multi-unit Build Planning · Smart PO Generation · Export CSV/Print · Enhanced Scan Workflow |
| **Phase 3** — Insights | Analytics Dashboard · Vendor Management · Part Labels/QR Print |
| **Phase 4** — Scale | Multi-product BOM · Push Notifications · Offline PWA · User Management UI · Part Images |
| **Phase 5** — Maintainability | Code architecture modernization |
