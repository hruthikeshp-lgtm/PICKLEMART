# 🏺 Pickle Mart — Online Traditional Pickle Store & Management Platform

> **"Feel the real taste, made by Grandma."**

Pickle Mart is a modern, responsive, full-stack e-commerce platform developed for a traditional Indian pickle business. It transforms a traditional printed menu into an elegant digital storefront featuring **all 43 authentic vegetarian and non-vegetarian pickles**, an intuitive cart, a validated checkout pipeline, live order tracking with phone verification, and a secure administrator portal.

---

## 🌟 Key Highlights & Business Capabilities

- **Exact Menu Catalog (43 Varieties)**:
  - **22 Vegetarian Pickles**: Mango Avakaya (₹150), Bellam Avakaya (₹140), Gongura (₹140), Ginger, Garlic, Red Chilli, and more.
  - **21 Non-Vegetarian Pickles**: Chicken Pickle (₹250), Boneless Chicken Pickle (₹300), Natukodi (₹350), Korameenu Fish (₹325), Pandugappa Fish (₹400), Crab (₹325), Small & Large Prawns, Mutton, Kheema, and Gongura infusions.
- **Strict Price Integrity**: All prices preserved exactly as supplied in the printed menu, stored internally as integer **paise** (e.g. ₹150 = `15000` paise) to prevent floating-point calculation errors.
- **Standard Packaging**: All pickles packaged in standard **250 grams** vacuum-sealed jars.
- **Server-Side Price Recalculation**: Order totals and line items are validated and calculated on the server using trusted database records, making client-side request tampering impossible.
- **Customer Shopping Flow**:
  - Live search by product name and ingredients
  - Category filtering: All Products, Veg Pickles, Non-Veg Pickles
  - Sorting: Price (Low to High, High to Low), Alphabetical (A–Z, Z–A), and Bestsellers
  - Interactive slide-over cart drawer and dedicated cart page
  - Free delivery threshold tracker (Free shipping above ₹500, else ₹50)
  - Persistent cart state across page refreshes via `localStorage`
  - Indian food FSSAI indicators (standard green veg and red/brown non-veg marks)
- **Order Placement & Tracking**:
  - Guest checkout with 10-digit mobile and 6-digit PIN validation
  - Unique order reference generator (e.g. `PM-26849`)
  - Direct WhatsApp order sharing integration with pre-filled items and delivery address
  - Milestone tracking stepper (*Pending Confirmation -> Confirmed -> Preparing -> Dispatched -> Delivered*)
  - Customer order security: Orders require phone number verification to access
- **Store Administrator Dashboard (`/admin`)**:
  - Protected by server authentication token (`admin123` default)
  - Overview KPI metrics: Total revenue in ₹, total orders, pending orders, delivered orders, catalog count
  - Product management: Create, edit prices, update images, toggle In Stock / Out of Stock, delete
  - Order management: Search by reference, filter by fulfillment status, update order & payment status
  - Customer contact inquiry inbox
- **Zero-Friction Local Persistence + Supabase PostgreSQL**:
  - Runs immediately out of the box with built-in persistent JSON/file engine (`data/store.json`)
  - Full PostgreSQL schema with Row Level Security (RLS) policies and seed script included (`supabase/schema.sql` and `supabase/seed.sql`)

---

## 📋 Complete Menu & Price Reference (250g Standard Pack)

### Vegetarian Pickles (22 Items)
| Product Name | Package Size | Price (INR) | Stored Paise |
| :--- | :---: | :---: | :---: |
| Mango Avakaya Pickle | 250 g | ₹150 | 15000 |
| Bellam Avakaya Pickle | 250 g | ₹140 | 14000 |
| Coriander Pickle | 250 g | ₹140 | 14000 |
| Red Chilli Pickle | 250 g | ₹140 | 14000 |
| Mango Thokku Pickle | 250 g | ₹140 | 14000 |
| Ginger Pickle | 250 g | ₹140 | 14000 |
| Curry Leaves Pickle | 250 g | ₹140 | 14000 |
| Garlic Pickle | 250 g | ₹140 | 14000 |
| Drumsticks Pickle | 250 g | ₹140 | 14000 |
| Green Chilli Pickle | 250 g | ₹140 | 14000 |
| Lemon Pickle | 250 g | ₹140 | 14000 |
| Tomato Pickle | 250 g | ₹140 | 14000 |
| Tamarind Pickle | 250 g | ₹140 | 14000 |
| Bitter Gourd Pickle | 250 g | ₹140 | 14000 |
| Gongura Pickle | 250 g | ₹140 | 14000 |
| Amla Pickle | 250 g | ₹140 | 14000 |
| Cauliflower Pickle | 250 g | ₹140 | 14000 |
| Pudina Pickle | 250 g | ₹140 | 14000 |
| Nallerukada Pickle | 250 g | ₹140 | 14000 |
| Dabbakaya Pickle | 250 g | ₹140 | 14000 |
| Red Chilli Gongura Pickle | 250 g | ₹140 | 14000 |
| Vankaya Pickle | 250 g | ₹140 | 14000 |

### Non-Vegetarian Pickles (21 Items)
| Product Name | Package Size | Price (INR) | Stored Paise |
| :--- | :---: | :---: | :---: |
| Chicken Pickle | 250 g | ₹250 | 25000 |
| Boneless Chicken Pickle | 250 g | ₹300 | 30000 |
| Natukodi Pickle | 250 g | ₹350 | 35000 |
| Korameenu Pickle | 250 g | ₹325 | 32500 |
| Pandugappa Fish Pickle | 250 g | ₹400 | 40000 |
| Crab Pickle | 250 g | ₹325 | 32500 |
| Small Prawn Pickle | 250 g | ₹375 | 37500 |
| Large Prawn Pickle | 250 g | ₹425 | 42500 |
| Mutton Pickle | 250 g | ₹425 | 42500 |
| Boneless Mutton Pickle | 250 g | ₹475 | 47500 |
| Mutton Kheema Pickle | 250 g | ₹475 | 47500 |
| Cheruvu Fish | 250 g | ₹300 | 30000 |
| Metalllu Fish | 250 g | ₹300 | 30000 |
| Chicken Gongura | 250 g | ₹250 | 25000 |
| Boneless Chicken Gongura | 250 g | ₹300 | 30000 |
| Natukodi Gongura | 250 g | ₹350 | 35000 |
| Small Prawn Gongura | 250 g | ₹375 | 37500 |
| Large Prawn Gongura | 250 g | ₹425 | 42500 |
| Mutton Gongura | 250 g | ₹375 | 37500 |
| Boneless Mutton Gongura | 250 g | ₹475 | 47500 |
| Mutton Kheema Gongura | 250 g | ₹425 | 42500 |

---

## 🛠️ Technology Architecture

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Design System**: Authentic Indian food palette:
  - Deep Pickle Red: `#781E26`
  - Burgundy: `#5B1720`
  - Mustard Yellow: `#F2B632`
  - Cream: `#FFF4E3`
  - Warm White: `#FFFCF7`
  - Dark Spice Text: `#2B211D`
  - Muted Herb Green: `#54734C`
- **Icons**: Lucide React
- **Backend & APIs**: Next.js Server Route Handlers (`/api/products`, `/api/orders`, `/api/admin`, `/api/inquiries`)
- **Database**:
  - Local Zero-Config Engine (`lib/db.ts` with auto-seeded JSON storage)
  - PostgreSQL / Supabase Schema (`supabase/schema.sql`) with Row-Level Security
- **Security**: Server-side price recalculation, administrative bearer token authorization, customer phone access checks.

---

## 🚀 Getting Started

### 1. Installation
Clone or navigate to the project directory:
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
*(Default admin password is `admin123`)*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Production Build
```bash
npm run build
npm run start
```

### 5. Run Verification Tests
```bash
node scripts/verify-store.js
```

---

## 🔐 Admin Portal Access

- **URL**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Default Password**: `admin123` *(configured via `ADMIN_SECRET` in `.env.local`)*

---

## 📦 Supabase Setup (Optional for Cloud Deployment)

1. Create a project in [Supabase](https://supabase.com).
2. Open the SQL Editor in Supabase Dashboard.
3. Paste and run the contents of [`supabase/schema.sql`](file:///c:/Users/haree/OneDrive/Desktop/New%20folder/supabase/schema.sql).
4. Run [`supabase/seed.sql`](file:///c:/Users/haree/OneDrive/Desktop/New%20folder/supabase/seed.sql) to populate all 43 products.
5. Add your Supabase URL and keys to `.env.local`.
