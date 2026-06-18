# FastVPN Backend API

## Installation

```bash
cd backend
npm install
```

## Environment Variables

Create `.env` file:

```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/fastvpn
JWT_SECRET=your_secret_key
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
PORT=5000
NODE_ENV=development
```

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/me` - Get current user
- `PUT /api/users/update` - Update profile
- `GET /api/users/subscriptions` - Get user subscriptions

### Subscriptions
- `POST /api/subscriptions/create` - Create subscription
- `GET /api/subscriptions/active` - Get active subscription
- `POST /api/subscriptions/renew/:id` - Renew subscription

### Payments
- `POST /api/payments/stripe/create-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `GET /api/payments/history` - Get payment history

### Blogs
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:slug` - Get single blog
- `POST /api/blogs/create` - Create blog (admin)
- `POST /api/blogs/publish/:id` - Publish blog (admin)

### Servers
- `GET /api/servers` - Get all servers
- `GET /api/servers/country/:country` - Get servers by country
- `POST /api/servers/add` - Add server (admin)

### Admin
- `GET /api/admin/stats` - Get dashboard stats
- `GET /api/admin/users` - Get all users
- `GET /api/admin/transactions` - Get all transactions
