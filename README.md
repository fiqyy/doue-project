# DOUE NOIR — Haute Atelier & Architectural Clothing E-Commerce

> An ultra-luxurious, fully operational full-stack e-commerce web application and Admin Portal built with **Next.js 14**, **TypeScript**, **Three.js 3D WebGL**, a custom **Vanilla CSS** monochrome design system, and an **Automated Email Notification Dispatcher**.

📖 **Looking to customize products, emails, passkeys, or colors? See the [Full Customization Guide](file:///d:/Career/Prog/doue%20project/CUSTOMIZATION_GUIDE.md).**

---

## 🌟 Key Features

### 1. High-Fashion Monochrome Storefront (`/`)
- **Aesthetic with Elegance**: Tailored in pure obsidian black (`#050506`), slate grey (`#262629`), and brushed titanium accents.
- **Three.js 3D Hero Sculpture**: Real-time 3D interactive drapery ribbon sculpture with dynamic studio lighting and mouse-tracking camera orbit.
- **Cinematic Runway Video Loop**: Autoplaying ambient luxury runway editorial background.
- **3D Interactive Product Cards**: Gyroscopic mouse-tracking 3D card tilt with specular light reflection gleam and instant size selector.
- **3D Atelier Turntable Viewer**: Integrated 360° product inspector with wireframe mode, auto-rotation, and zoom controls.
- **Curated Collections**: Outerwear, Tailoring, Knitwear, Trousers, Footwear, and Leather Goods.
- **Slide-out Cart Drawer**:
  - Live calculations for subtotal, luxury import taxes, and express courier fees.
  - Progress bar toward complimentary worldwide courier ($2,000 threshold).
  - VIP Promo Code engine (`DOUEVIP10` for 10% off, `ARCHIVE20` for 20% off).
  - Complimentary Atelier gift packaging toggle (archival box & satin ribbon).
- **Secure Multi-Step Checkout Modal**:
  - Client shipping destination input with one-click **"Auto-fill Demo Details"** for fast testing.
  - 3D Black Titanium VIP card simulation with interactive card preview.
  - Instant order authorization and generation of custom order references (e.g., `DOUE-84920`).
- **Real-Time Order Tracking Modal**:
  - Search any order reference (e.g. `DOUE-84920`).
  - Interactive 4-step progress line (Order Confirmed → Atelier Tailoring → Courier Dispatched → Delivered).
  - Insured carrier tracking numbers (DHL Express, FedEx) with external tracking link.
- **VIP Atelier Salon Subscription**: Newsletter sign-up for private salon allocations.

---

### 2. Operational Admin Portal (`/admin` — Protected by Password `aro2026`)
- **Restricted Access**: Public buttons have been removed from the header, mobile drawer, and footer.
- **Access Methods**:
  1. **From Homepage**: Press `Ctrl+Shift+A` or `Alt+A`, or click the footer copyright line (`© 2026 DOUE NOIR ATELIER`) to trigger the secret passkey modal.
  2. **Direct Navigation**: Navigate directly to `http://localhost:3000/admin`.
  3. **Passkey**: Enter password `aro2026` to unlock the vault.
- **Live Business KPIs**:
  - Total Atelier Revenue, Total Acquisitions, Average Order Value (AOV).
  - Breakdown by order status (Pending, Processing, Shipped, Delivered).
  - Low stock allocation alerts.
- **Order Management & Detail Drawer**:
  - Search orders by reference number, client name, or email.
  - Filter orders by status (*All, Pending, Processing, Shipped, Delivered*).
  - Detailed Order Drawer: View complete client address, items, sizes, colors, and notes.
  - **Status & Tracking Updater**: Update order status from `Pending` to `Processing` or `Shipped`, assign carrier and waybill numbers (e.g., `DHL-EX-99881122US`), and notify clients.
- **Order Email Notification Dispatcher**:
  - **Instant Real-Time Alerts**: Dispatched to the configured Admin email whenever a customer orders on the storefront.
  - **Client Confirmation**: Dispatched to the customer's email with an itemized receipt.
  - **1-Click "View Rendered HTML Email" Modal**: Live sandbox to inspect the exact high-fashion HTML email template sent to the admin.
  - **Email Dispatch Logs Tab**: Audit trail of all notifications sent by the system.
  - **Resend Notification Button**: Re-trigger emails with a single click.
- **Product Catalog Management**:
  - View all active pieces, prices, categories, and inventory counts.
  - **"Add New Luxury Piece" Modal**: Create garments with custom images, materials, descriptions, pricing, and stock.
  - Instant deletion/archival of products.
- **Notification & SMTP Settings**:
  - Configure the store director's alert email address.
  - Built-in automatic fallback so emails are always reliably recorded even without external SMTP credentials.
  - Supports standard production SMTP via environment variables (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_PORT`).

---

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict Mode)
- **3D Graphics & Shaders**: Three.js (`@types/three`)
- **Styling**: Handcrafted Vanilla CSS Design System (`src/styles/globals.css`)
- **Database**: Atomic JSON Persistence (`data/doue-store.json`) with automated backup and seed data
- **Email Pipeline**: Nodemailer with custom luxury HTML email templates
- **Icons**: Lucide React

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** for the storefront or **[http://localhost:3000/admin](http://localhost:3000/admin)** for the Admin Portal.

### 3. Production Build
```bash
npm run build
npm run start
```

---

## 🔑 Demo VIP Codes
- `DOUEVIP10` — 10% VIP client privilege discount
- `ARCHIVE20` — 20% Atelier archive allocation discount
