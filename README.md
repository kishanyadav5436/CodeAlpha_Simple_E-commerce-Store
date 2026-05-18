# CodeAlpha_Simple_E-commerce-Store

A fullstack e-commerce storefront built for the CodeAlpha internship. Features a Node.js/Express backend with MongoDB, a premium dark-themed glassmorphism frontend, product browsing with category filtering, a persistent shopping cart, and a checkout flow with order creation.

## 🚀 Tech Stack
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Icons:** Font Awesome 6
- **Fonts:** Inter (Google Fonts)

## 🌟 Features
1. **Product Catalog** — Browse 12 curated products across 4 categories (Electronics, Accessories, Apparel, Home).
2. **Category Filtering** — Filter products by category via the navigation bar.
3. **REST API** — Backend serves products from MongoDB and accepts order creation.
4. **Shopping Cart** — Slide-out cart sidebar with add/remove items, quantity controls, and price summary.
5. **Cart Persistence** — Cart data saved to `localStorage`, survives page refreshes.
6. **Free Shipping** — Orders over $100 qualify for free shipping.
7. **Order Checkout** — Orders are submitted to the backend API and stored in MongoDB.
8. **Toast Notifications** — Visual feedback when adding items to the cart.
9. **Responsive Design** — Fully responsive layout for desktop, tablet, and mobile.

## 📂 Project Structure
```text
CodeAlpha_Simple_E-commerce-Store/
├── backend/                     # Express.js backend
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── controllers/
│   │   ├── productController.js # Product API logic
│   │   └── orderController.js   # Order/checkout logic
│   ├── models/
│   │   ├── Product.js           # Product schema
│   │   └── Order.js             # Order schema
│   ├── routes/
│   │   ├── productRoutes.js     # Product routes
│   │   └── orderRoutes.js       # Order routes
│   ├── .env                     # Environment variables
│   ├── seed.js                  # Database seeder script
│   ├── server.js                # Express entry point
│   └── package.json             # Backend dependencies
├── frontend/                    # Static frontend
│   ├── css/
│   │   └── style.css            # Premium dark-mode styling
│   ├── js/
│   │   ├── products.js          # Fallback local product data
│   │   └── app.js               # Cart logic, API calls, rendering
│   └── index.html               # Main entry point
└── README.md                    # Project documentation
```

## 🛠️ How to Run
1. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```
2. **Seed the database** (requires a running MongoDB instance):
   ```bash
   npm run seed
   ```
3. **Start the server:**
   ```bash
   npm run dev
   ```
4. **Open in browser:** Navigate to `http://localhost:5000`

## 📡 API Endpoints
| Method | Endpoint                  | Description                  |
|--------|---------------------------|------------------------------|
| GET    | `/api/products`           | Get all products             |
| GET    | `/api/products?category=` | Filter products by category  |
| GET    | `/api/products/:id`       | Get a single product         |
| POST   | `/api/orders`             | Create a new order           |
| GET    | `/api/orders/:id`         | Get order by ID              |