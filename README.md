# FreshMart - Grocery Shopping Application

A full-stack grocery shopping application built with React, Node.js, Express, and MongoDB. This project features both a client-side shopping experience and a seller dashboard for managing products and orders.

## Features

### Client Side
- Browse products by category
- Search products
- Add products to cart
- User authentication (Login/Register)
- Order placement and tracking
- User profile management

### Seller Side
- Seller dashboard with statistics
- Product management (Add, Edit, Delete)
- Order management
- Revenue tracking

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React 18
- React Router DOM
- Context API (AppContext) for state management
- Axios for API calls
- CSS3 for styling

## Project Structure

```
Grocery-Project/
├── server/                 # Backend
│   ├── models/            # Mongoose models
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/            # API routes
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   └── seller.js
│   ├── middleware/        # Auth middleware
│   │   └── auth.js
│   └── index.js          # Server entry point
├── client/                # Frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   │   └── seller/   # Seller pages
│   │   ├── context/      # AppContext
│   │   └── App.js
│   └── public/
└── README.md
```

## Installation

1. Clone the repository
```bash
cd Grocery-Project
```

2. Install dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables
```bash
# In server directory, create .env file
cd server
cp .env.example .env
```

Edit `server/.env` file:
```
MONGODB_URI=mongodb://localhost:27017/freshmart
JWT_SECRET=your_jwt_secret_key_here
PORT=5001
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
```

Create `client/.env` file:
```
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

**Stripe Setup:**
1. Sign up at https://stripe.com
2. Get your API keys from the Stripe Dashboard
3. Use test keys (starting with `sk_test_` and `pk_test_`) for development
4. Add the keys to the respective `.env` files above

4. Start MongoDB
Make sure MongoDB is running on your system.

5. Run the application
```bash
# From root directory
npm run dev
```

This will start both server (port 5000) and client (port 3000) concurrently.

Or run separately:
```bash
# Terminal 1 - Server
cd server
npm run dev

# Terminal 2 - Client
cd client
npm start
```

## Usage

### Register as Customer
1. Go to `/register`
2. Fill in your details and register
3. Start shopping!

### Seller/Admin Accounts
- **Sellers are admins** and cannot be registered through the public signup form
- Seller accounts must be created manually (through database or admin panel)
- Use the seed script to create a test seller account: `npm run seed` in server directory
- Default test seller: `seller@freshmart.com` / `seller123`

### Seller Features
- Add products from seller dashboard
- Manage product inventory
- View and update order status
- Track revenue and statistics

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `GET /api/products/category/:category` - Get products by category

### Payment (Stripe)
- `POST /api/payment/create-payment-intent` - Create Stripe payment intent
- `POST /api/payment/confirm-payment` - Confirm payment status

### Orders
- `POST /api/orders` - Create new order (Client only)
- `GET /api/orders/myorders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status

### Seller
- `GET /api/seller/products` - Get seller products
- `POST /api/seller/products` - Create product
- `PUT /api/seller/products/:id` - Update product
- `DELETE /api/seller/products/:id` - Delete product
- `GET /api/seller/orders` - Get seller orders
- `GET /api/seller/dashboard` - Get seller stats

## Notes

- Make sure MongoDB is installed and running
- Default server port: 5001 (changed from 5000 to avoid macOS AirPlay conflict)
- Default client port: 3000
- JWT tokens are stored in localStorage
- Cart is managed using React Context API
- Stripe integration for card payments (test mode)
  - Test card: 4242 4242 4242 4242
  - Any future expiry date
  - Any 3-digit CVC

## License

This project is open source and available for educational purposes.

