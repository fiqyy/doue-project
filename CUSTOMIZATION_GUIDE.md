# DOUE NOIR — Full Customization & Operations Guide

> A comprehensive, step-by-step manual on how to configure, customize, and operate every feature of the **DOUE NOIR** Haute Atelier E-Commerce Web Application and Admin Portal.

---

## 📖 Quick Passkey Reference
- **Admin Portal Access**: `Ctrl+Shift+A`, `Alt+A`, or click footer copyright text (`© 2026 DOUE NOIR ATELIER`).
- **Default Passkey**: `aro2026`
- **Password Change**: Edit `.env.local` or `src/app/api/admin/auth/route.ts`.

---

## 📋 Table of Contents
1. [Admin Portal Access & Changing the Password](#1-admin-portal-access--changing-the-password)
2. [Email Notifications & Real SMTP Setup](#2-email-notifications--real-smtp-setup)
3. [Managing Products & Inventory](#3-managing-products--inventory)
4. [Customizing 3D Animations, Videos & Media](#4-customizing-3d-animations-videos--media)
5. [Brand Identity, Typography & Color Palette](#5-brand-identity-typography--color-palette)
6. [VIP Promo Codes, Free Shipping & Pricing](#6-vip-promo-codes-free-shipping--pricing)
7. [Orders Database & Fulfillments](#7-orders-database--fulfillments)
8. [Environment Variables & Deployment Checklist](#8-environment-variables--deployment-checklist)

---

## 1. Admin Portal Access & Changing the Password

### How to Access the Admin Portal
The public admin button has been removed from the website so ordinary visitors cannot see it. You can access the Admin Portal in two ways:

1. **Direct Navigation**: Go to [http://localhost:3000/admin](http://localhost:3000/admin) in your browser.
2. **From the Homepage**:
   - **Keyboard Shortcut**: Press `Ctrl + Shift + A` (or `Alt + A`).
   - **Secret Typing**: Simply type `admin` anywhere on the homepage.
   - **Discreet Click**: Click the copyright text in the footer: `© 2026 DOUE NOIR ATELIER`.

### How to Change the Admin Password
Currently, the passkey is set to **`aro2026`**. You can change it in two ways:

#### Option A: Using an Environment Variable (Recommended)
Create or edit a `.env.local` file in the root of your project:
```env
ADMIN_PASSWORD=your_new_secure_password_here
```
The authentication route automatically checks `process.env.ADMIN_PASSWORD` first.

#### Option B: In the Source Code
Open [`src/app/api/admin/auth/route.ts`](file:///d:/Career/Prog/doue%20project/src/app/api/admin/auth/route.ts):
```typescript
// Line 3:
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'your_new_password_here';
```

---

## 2. Email Notifications & Real SMTP Setup

Whenever a client acquires pieces on the website, two emails are automatically generated:
1. **Admin High-Value Order Alert**: Dispatched to the store owner with client destination, order items, and a direct portal link.
2. **Customer Order Receipt**: Dispatched to the client with order reference, items, and tracking details.

---

### A. Changing the Admin Notification Email Address
To change where order alerts are sent:

#### Via the Admin Portal (No-Code):
1. Unlock the Admin Portal at [http://localhost:3000/admin](http://localhost:3000/admin) using password `aro2026`.
2. Click the **"NOTIFICATION SETTINGS"** tab.
3. Update the **"ADMIN RECIPIENT EMAIL ADDRESS"** input (e.g. `orders@yourbrand.com`).
4. Click **"SAVE NOTIFICATION SETTINGS"**.

#### Via Code / Initial Seed:
Open [`src/lib/seed-data.ts`](file:///d:/Career/Prog/doue%20project/src/lib/seed-data.ts):
```typescript
export const INITIAL_SETTINGS: AdminSettings = {
  adminEmail: 'orders@yourbrand.com',
  storeName: 'DOUE NOIR ATELIER',
  currency: 'USD',
  smtpConfigured: false,
  senderName: 'DOUE ATELIER Haute Couture'
};
```

---

### B. Connecting Real Email Dispatchers (SMTP)
By default, the application records every email in the **Email Dispatch Logs** with an interactive HTML preview so you never lose orders during testing.

To send real emails to inboxes via Gmail, SendGrid, Amazon SES, Brevo, or Mailgun, configure `.env.local`:

```env
# Production SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
```

> **Tip for Gmail Users**: Use a Google **App Password** (Google Account → Security → 2-Step Verification → App Passwords).

---

### C. Customizing the HTML Email Design
The luxury monochrome email template is in [`src/lib/email.ts`](file:///d:/Career/Prog/doue%20project/src/lib/email.ts).
- Change the header brand title in `generateOrderEmailHtml()`.
- Adjust colors, email banner text, or font styles.
- Change the email subject lines in `dispatchOrderNotifications()`:
```typescript
const adminSubject = `[DOUE ATELIER] Order Alert: ${order.orderNumber} ($${order.total.toLocaleString()})`;
const customerSubject = `DOUE NOIR — Acquisition Confirmed #${order.orderNumber}`;
```

---

## 3. Managing Products & Inventory

### A. Adding / Editing Products via the Admin Portal (No-Code)
1. Go to [http://localhost:3000/admin](http://localhost:3000/admin) and log in with `aro2026`.
2. Click the **"PRODUCT CATALOG"** tab.
3. Click **"ADD NEW LUXURY PIECE"**.
4. Fill in:
   - **Piece Name**: e.g., *Double-Breasted Wool Peacoat*
   - **Category**: Outerwear, Tailoring, Knitwear, Trousers, Footwear, or Leather Goods
   - **Price**: in USD (e.g., `1450`)
   - **Stock Count**: Available inventory allocation
   - **Image URL**: Direct link to your product photography
   - **Materials**: e.g., *100% Virgin Cashmere (700gsm)*
   - **Description**: Artisanal design story
5. Click **"PUBLISH TO ATELIER CATALOG"**. It will appear instantly on the live storefront!

---

### B. Adding Local Product Images
If you want to use your own local photos instead of web links:
1. Save your photos in the `public/products/` folder:
   - Example: `public/products/coat-black-1.jpg`
2. In the Admin Portal or code, reference the path starting with `/products/`:
   - `images: ['/products/coat-black-1.jpg']`

---

### C. Editing Default Products in Code
The default seed catalog is defined in [`src/lib/seed-data.ts`](file:///d:/Career/Prog/doue%20project/src/lib/seed-data.ts):
```typescript
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'doue-001',
    name: 'Atelier Cashmere Overcoat',
    subtitle: 'Double-Faced Loro Piana Cashmere / Noir',
    price: 1850,
    originalPrice: 2200,
    category: 'outerwear',
    description: 'Sculptural trench overcoat hand-tailored in Biella...',
    details: [
      '100% Double-Faced Italian Cashmere (680gsm)',
      'Handcrafted in Milan Atelier'
    ],
    materials: '100% Loro Piana Virgin Cashmere',
    care: 'Specialist luxury dry clean only.',
    images: ['https://images.unsplash.com/...'],
    colors: [
      { name: 'Obsidian Black', hex: '#0a0a0a' },
      { name: 'Slate Charcoal', hex: '#262629' }
    ],
    sizes: ['46 / S', '48 / M', '50 / L', '52 / XL'],
    inStock: true,
    stockCount: 8,
    featured: true,
    badge: 'RUNWAY SS26',
    threeDType: 'coat' // 'coat' | 'blazer' | 'bag' | 'boots' | 'trousers'
  }
];
```

---

## 4. Customizing 3D Animations, Videos & Media

### A. Changing the Hero Video Background
In [`src/app/page.tsx`](file:///d:/Career/Prog/doue%20project/src/app/page.tsx) (around line 265):
```tsx
<video
  autoPlay
  muted
  loop
  playsInline
  className="hero-bg-video"
  src="YOUR_VIDEO_URL_HERE.mp4"
/>
```
> **Tip**: You can place your own video file (e.g. `runway.mp4`) inside the `public/` folder and set `src="/runway.mp4"`.

---

### B. Customizing the 3D Hero Sculpture
The interactive 3D hero canvas is built with Three.js in [`src/components/ThreeHeroCanvas.tsx`](file:///d:/Career/Prog/doue%20project/src/components/ThreeHeroCanvas.tsx):
- **Sculpture Shape**: Change `TorusKnotGeometry(5.2, 1.3, 160, 36, 2, 3)` to modify the geometry knots.
- **Material & Metalness**: Change `metalness: 0.85`, `roughness: 0.25`, and `clearcoat: 0.9` to adjust how light reflects off the silk/metallic drapery.
- **Particle Count**: Modify `particleCount = 180` to increase or decrease ambient floating dust/particles.

---

### C. Customizing the 3D Product Turntable Viewer
The product turntable is located in [`src/components/ThreeProductViewer.tsx`](file:///d:/Career/Prog/doue%20project/src/components/ThreeProductViewer.tsx):
- Tailored geometry for each `threeDType`: `'coat'`, `'blazer'`, `'bag'`, `'boots'`, and `'trousers'`.
- Toggle between solid high-sheen cloth shader and wireframe seam inspection.
- Auto-spin speed: adjust `stateRef.current.rotationY += 0.007`.

---

## 5. Brand Identity, Typography & Color Palette

All visual tokens are defined in Vanilla CSS inside [`src/styles/globals.css`](file:///d:/Career/Prog/doue%20project/src/styles/globals.css):

```css
:root {
  /* Obsidian & Monochrome Palette */
  --bg-deep: #050506;          /* Deepest background */
  --bg-surface: #0c0c0e;       /* Card surfaces */
  --bg-card: #131317;          /* Product cards */
  --bg-elevated: #1e1e26;      /* Inputs and active panels */

  /* Borders & Dividers */
  --border-subtle: rgba(255, 255, 255, 0.07);
  --border-medium: rgba(255, 255, 255, 0.14);
  --border-strong: rgba(255, 255, 255, 0.28);

  /* Typography Colors */
  --text-primary: #fcfcfd;     /* Pure chalk white */
  --text-secondary: #a1a1aa;   /* Soft slate */
  --text-muted: #71717a;       /* Subtle graphite */

  /* Fonts */
  --font-serif: 'Cormorant Garamond', serif;
  --font-display: 'Cinzel', serif;
  --font-sans: 'Plus Jakarta Sans', sans-serif;
  --font-mono: 'Space Grotesk', monospace;
}
```

### Changing the Brand Name
To rename from **DOUE NOIR** to your brand:
1. [`src/components/Header.tsx`](file:///d:/Career/Prog/doue%20project/src/components/Header.tsx): Update the logo text (lines 50-65).
2. [`src/app/page.tsx`](file:///d:/Career/Prog/doue%20project/src/app/page.tsx): Update Hero titles and Footer copyright.
3. [`src/app/layout.tsx`](file:///d:/Career/Prog/doue%20project/src/app/layout.tsx): Update SEO `<title>` and `<meta>` description.

---

## 6. VIP Promo Codes, Free Shipping & Pricing

All financial thresholds are configured in [`src/components/CartDrawer.tsx`](file:///d:/Career/Prog/doue%20project/src/components/CartDrawer.tsx):

### A. Adding / Changing Promo Codes
Find `handleApplyPromo()` around line 43:
```typescript
const handleApplyPromo = () => {
  setPromoError('');
  const code = promoCode.trim().toUpperCase();

  if (code === 'DOUEVIP10') {
    setDiscountPercent(10); // 10% off
    setAppliedPromo(code);
  } else if (code === 'ARCHIVE20') {
    setDiscountPercent(20); // 20% off
    setAppliedPromo(code);
  } else if (code === 'YOUR_NEW_CODE') {
    setDiscountPercent(15); // Custom 15% off
    setAppliedPromo(code);
  } else {
    setPromoError('Invalid VIP key. Try DOUEVIP10 or ARCHIVE20');
  }
};
```

### B. Free Shipping Threshold
In `CartDrawer.tsx` (line 33):
```typescript
const freeShippingThreshold = 2000; // Complimentary shipping on orders >= $2,000
const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 45;
```

### C. Tax Calculation
In `CartDrawer.tsx` and `CheckoutModal.tsx`:
```typescript
const tax = taxable * 0.08; // 8% estimated import duty / tax
```

---

## 7. Orders Database & Fulfillments

### A. Database Storage Location
The application uses a reliable, atomic JSON database located at:
```
data/doue-store.json
```
- It stores all **Products**, **Orders**, **Email Logs**, and **Admin Settings**.
- Writes are performed atomically using temp files, so your data is safe even during power disruptions or server restarts.

### B. Updating Order Fulfillment Status
1. Open the Admin Portal at [http://localhost:3000/admin](http://localhost:3000/admin).
2. Click on any order to open the fulfillment drawer.
3. Change status from `pending` → `processing` → `shipped` → `delivered`.
4. Add the tracking waybill number (e.g. `DHL-EX-99881122US`) and carrier (`DHL Express Worldwide`).
5. Click **"UPDATE ORDER STATUS"**. The client can now track their package in real-time via the storefront tracking modal!

---

## 8. Environment Variables & Deployment Checklist

### Local Development (`.env.local`)
Create a `.env.local` file in the project root:
```env
# Optional Custom Admin Password (default is aro2026)
ADMIN_PASSWORD=aro2026

# Optional Real SMTP Email Provider
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Deployment Commands
```bash
# 1. Install dependencies
npm install

# 2. Test production build
npm run build

# 3. Start production server
npm run start
```

### Recommended Hosting Providers
- **Vercel**: One-click Next.js deployment.
- **Railway / Render**: Full support for file persistence and Docker.
- **DigitalOcean / AWS VPS**: Run with `pm2 start npm --name "doue-atelier" -- run start`.

---

© 2026 DOUE NOIR ATELIER. All rights reserved.
