# 🌟 AURA — Enterprise-Grade MERN E-Commerce Platform

A production-ready, full-stack E-Commerce web application engineered with the **MERN** stack (MongoDB, Express, React, Node.js), featuring **dual interfaces** (Customer & Admin), an ambient animated background, and an architecture prepared for instant payment gateway integration (Stripe, Razorpay, or PayPal).

---

## 🎯 Architecture Highlights & Customer/Admin Design

### 🛍️ Customer Experience
- **Public & Frictionless Browsing**: Customers can immediately visit the store, browse the curated catalog, filter by categories, search items, inspect details, and add items to their shopping bag **without needing an account or logging in**.
- **Checkout Auth Trigger**: An account is requested **only when the customer decides to proceed to checkout / buy an item**.
  - If unauthenticated, a smooth glassmorphic authentication modal appears allowing the customer to either **Sign In** or **Register a new account** in seconds.
  - A convenient **1-Click Demo Customer Autofill** (`customer@store.com`) is provided for instant testing.
- **Order Tracking**: Logged-in customers can track order timelines, delivery destinations, and previous purchase receipts under **My Orders**.

### 🛡️ Admin Experience
- **Protected Administrator Gateway**: Accessible via `/admin/login` or the header's Admin button.
- **Strict Role-Based Access Control (RBAC)**: Only accounts with `role: 'admin'` can access administrative endpoints and the dashboard. Normal customer logins are rejected at the admin gate.
- **Operations & Analytics Dashboard** (`/admin`):
  - **Live Metrics**: Total Revenue ($), Total Orders, Total SKUs, Registered Customers.
  - **Fulfillment Pipeline**: Real-time counter of `Pending`, `Processing`, `Shipped`, and `Delivered` orders.
  - **Product Catalog Management** (`/admin/products`): Full CRUD (Create, Read, Update, Delete) with image preview, stock management, and featured drop toggle.
  - **Orders Fulfillment Center** (`/admin/orders`): Update order status in real time, view delivery addresses, contact numbers, and ordered items.

---

## 🌐 Background Animation & Styling
- Interactive animated constellation particles on HTML5 Canvas.
- Ambient multi-layered luminous floating gradient orbs with hardware-accelerated CSS blur.
- High-standard dark mode luxury tech aesthetic with glassmorphic cards and polished micro-interactions.

---

## 💳 UPI Payment Gateway (QR Code & Mobile App Intent)
The store is integrated with a dynamic, responsive UPI payment gateway following NPCI standards:
- **💻 On Laptop / Desktop**:
  - Renders a dynamic, high-contrast **QR Code** generated directly in the browser via `qrcode.react`.
  - Displays formatted amount in **INR** (converted automatically from USD) and USD.
  - Live 10-minute validity countdown timer.
  - 1-click **Copy UPI ID** button.
  - Compatible with all Indian UPI apps (**Google Pay**, **PhonePe**, **Paytm**, **BHIM**, **Cred**).
- **📱 On Phone / Mobile Device**:
  - Automatically detects mobile devices.
  - Launches installed UPI apps directly via deep link (`upi://pay?pa=...&am=...&cu=INR`).
  - One-tap quick shortcuts for **GPay**, **PhonePe**, **Paytm**, and **BHIM**.
  - Toggle available to switch between QR and direct intent.
- **⚡ Verification & Order Confirmation**:
  - UTR / Reference ID input (with 1-click test auto-fill).
  - Simulated verification: Automatically marks `isPaid: true`, sets `paymentMethod: 'UPI (QR / Direct Intent)'`, records in database, and launches celebratory confetti.

---

## 🚀 Quick Start Guide

### 1. Database Setup (MongoDB Atlas)
Your connection string is pre-configured in `server/.env`.
Open `server/.env` and replace `<db_password>` with your actual MongoDB Atlas database password:

```env
PORT=5000
MONGO_URI=mongodb+srv://prurneshgowda_db_user:<YOUR_ACTUAL_PASSWORD>@stocks.5ynw6ay.mongodb.net/ecommerce?retryWrites=true&w=majority
JWT_SECRET=ecommerce_jwt_super_secret_key_987654321_secure_dev
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

> **Note**: Even if you test before setting your database password, the backend has a graceful fallback catalog to ensure you can test the frontend UI immediately!

### 2. Seed Initial Database (Optional but Recommended)
Once your password is added in `server/.env`, populate the database with curated products, default admin, and customer accounts:

```bash
npm run seed
```

### 3. Launch Backend & Frontend

In Terminal 1 (Start Express API Server):
```bash
npm run server
```
*API runs at:* `http://localhost:5000`

In Terminal 2 (Start React Vite Client):
```bash
npm run client
```
*App runs at:* `http://localhost:5173`

---

## 🔑 Default Credentials

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@store.com` | `admin123` | Full Admin Dashboard (`/admin`), Products CRUD, Orders |
| **Customer** | `customer@store.com` | `customer123` | Storefront browsing, Checkout, Order Tracking |
| **New Customer** | *Any email* | *6+ chars* | Auto-creates through checkout registration modal |

---

## 📁 Project Structure

```
c:\Users\prurn\odoo
├── server/
│   ├── config/db.js             # Resilient MongoDB Atlas connector
│   ├── controllers/
│   │   ├── authController.js    # JWT register, login, adminLogin, profile
│   │   ├── productController.js # Catalog retrieval, search, filter, CRUD
│   │   └── orderController.js   # Order creation, status updates, metrics
│   ├── middleware/auth.js       # JWT verification & Admin RBAC check
│   ├── models/
│   │   ├── User.js              # User schema with bcrypt password hashing
│   │   ├── Product.js           # SKU schema with stock & ratings
│   │   └── Order.js             # Order schema with shipping & payment hooks
│   ├── routes/                  # Express API routes
│   ├── seeder.js                # Initial database seed script
│   ├── server.js                # Main Express server entry point
│   └── .env                     # Server environment variables
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnimatedBackground.jsx # Canvas particles + glowing mesh orbs
│   │   │   ├── Navbar.jsx             # Brand logo, cart badge, portals
│   │   │   ├── ProductCard.jsx        # Glass card, add to bag, buy now
│   │   │   ├── CartDrawer.jsx         # Slide-over shopping bag
│   │   │   ├── AuthModal.jsx          # Seamless login/registration modal
│   │   │   ├── Toast.jsx              # Micro-interaction notifications
│   │   │   └── Footer.jsx             # Standard luxury store footer
│   │   ├── context/
│   │   │   ├── AuthContext.jsx        # JWT session & admin RBAC state
│   │   │   └── CartContext.jsx        # LocalStorage synced shopping bag
│   │   ├── pages/
│   │   │   ├── HomePage.jsx           # Hero, filter pills, search, catalog
│   │   │   ├── ProductDetailsPage.jsx # Image gallery, stock, purchase
│   │   │   ├── CheckoutPage.jsx       # Shipping form & gateway hooks
│   │   │   ├── OrderSuccessPage.jsx   # Confetti celebration & receipt
│   │   │   ├── CustomerOrdersPage.jsx # Order history timeline
│   │   │   └── admin/
│   │   │       ├── AdminLogin.jsx     # Dedicated Admin gateway
│   │   │       ├── AdminDashboard.jsx # Financial metrics & pipeline
│   │   │       ├── AdminProducts.jsx  # Catalog inventory CRUD
│   │   │       └── AdminOrders.jsx    # Order fulfillment status updater
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── vite.config.js
└── package.json
```

