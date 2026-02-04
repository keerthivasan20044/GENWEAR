# GENWEAR - Premium E-Commerce Platform

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)

A modern, full-stack MERN (MongoDB, Express, React, Node.js) e-commerce platform for premium fashion with professional design and robust backend.

## ✨ Features

### Frontend
- ✅ Modern React 18 with Vite
- ✅ Redux Toolkit state management
- ✅ Beautiful UI with Tailwind CSS
- ✅ Smooth animations with Framer Motion
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Product filtering and search
- ✅ Shopping cart with persistence
- ✅ User authentication & profiles
- ✅ Order management
- ✅ Wishlist functionality

### Backend
- ✅ Express.js REST API
- ✅ MongoDB with Mongoose ODM
- ✅ JWT authentication
- ✅ Password hashing with bcryptjs
- ✅ Rate limiting
- ✅ CORS enabled
- ✅ Helmet security
- ✅ Request compression
- ✅ Admin dashboard
- ✅ Product management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- MongoDB (local or Atlas)
- Git

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/yourusername/genwear.git
cd genwear
```

#### 2. Install Backend Dependencies
```bash
cd server
npm install
```

#### 3. Install Frontend Dependencies
```bash
cd ../client
npm install
```

#### 4. Configure Environment Variables

**Server (.env):**
```bash
cd ../server
cp .env.example .env
# Edit .env with your configuration
```

**Client (.env):**
```bash
cd ../client
cp .env.example .env
# Edit .env with your API URL
```

### Running the Application

#### Start Backend Server
```bash
cd server
npm run dev
```
Server runs on: `http://localhost:5000`

#### Start Frontend Development
```bash
cd client
npm run dev
```
Frontend runs on: `http://localhost:5173`

### Access the Application
Open your browser and navigate to: `http://localhost:5173`

## 📚 Project Structure

```
genwear/
├── server/                          # Backend
│   ├── config/                     # Database & external configs
│   ├── controllers/                # Route controllers
│   ├── middleware/                 # Auth, validation, error handling
│   ├── models/                     # MongoDB schemas
│   ├── routes/                     # API endpoints
│   ├── utils/                      # Helper functions
│   ├── data/                       # Seed data
│   ├── server.js                   # Entry point
│   └── package.json
│
├── client/                          # Frontend
│   ├── src/
│   │   ├── components/             # React components
│   │   ├── pages/                  # Page components
│   │   ├── redux/                  # Redux store & slices
│   │   ├── services/               # API services
│   │   ├── utils/                  # Utility functions
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── App.jsx                 # Main App component
│   │   └── main.jsx                # Entry point
│   ├── public/                     # Static assets
│   ├── package.json
│   └── vite.config.js
│
├── API_DOCUMENTATION.md            # Complete API reference
├── README.md                       # This file
└── .gitignore
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Products
- `GET /api/products` - Get all products with filters
- `GET /api/products/:id` - Get single product
- `GET /api/products/search` - Search products

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove from cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/myorders` - Get user orders
- `GET /api/orders/:orderId` - Get order details

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats` - Get dashboard stats
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

**Full API documentation:** See [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

## 🛠️ Available Scripts

### Server Scripts
```bash
npm run dev     # Start development server with nodemon
npm start       # Start production server
npm run seed    # Seed database with demo data
npm run lint    # Run ESLint
npm test        # Run tests
```

### Client Scripts
```bash
npm run dev     # Start Vite dev server
npm run build   # Build for production
npm run preview # Preview production build
npm run lint    # Run ESLint
npm run format  # Format code with Prettier
```

## 🔐 Security Features

- JWT token-based authentication (30-day expiration)
- Password hashing with bcryptjs
- CORS protection
- Helmet security headers
- Rate limiting (100 requests per 15 minutes)
- Request validation with express-validator
- Protected admin routes

## 📦 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite 5** - Build tool
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime
- **Express 4** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Helmet** - Security
- **Morgan** - Logging

## 🎨 Design

- **Modern & Clean UI** - Professional design system
- **Responsive Design** - Works on all devices
- **Smooth Animations** - Framer Motion animations
- **Consistent Branding** - Professional color scheme
- **Accessible** - WCAG compliant

## 👤 Demo Credentials

**Admin Account:**
```
Email: admin@genwear.com
Password: Admin@123
```

**Customer Account:**
```
Email: customer@genwear.com
Password: Customer@123
```

## 🚢 Deployment

### Deploy to Production

**Backend (Heroku/Railway):**
1. Set environment variables
2. Push to git
3. Deploy command runs `npm start`

**Frontend (Vercel/Netlify):**
1. Build: `npm run build`
2. Deploy `dist` folder

## 📝 Environment Variables

### Server (.env)
```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/genwear
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

### Client (.env)
```
VITE_API_URL=http://localhost:5000
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Contact

- **Email:** support@genwear.com
- **Website:** https://genwear.example.com
- **GitHub Issues:** [Report a bug](https://github.com/yourusername/genwear/issues)

## 🙏 Acknowledgments

- React community
- Tailwind CSS
- MongoDB Atlas
- Cloudinary
- All contributors

---

**Version:** 2.0.0  
**Last Updated:** January 24, 2026  
**Status:** ✅ Production Ready
