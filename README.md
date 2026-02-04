# 🛍️ GENWEAR - Next Generation E-Commerce Platform

<div align="center">

![GENWEAR](https://img.shields.io/badge/GENWEAR-E--Commerce-DC2626?style=for-the-badge)
![Version](https://img.shields.io/badge/version-2.0-10B981?style=for-the-badge)
![Status](https://img.shields.io/badge/status-Production%20Ready-10B981?style=for-the-badge)

**Wear the Next Generation**

A full-stack, production-ready e-commerce platform built with the MERN stack, featuring advanced shopping capabilities, admin management, and modern design.

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Tech Stack](#-tech-stack) • [Screenshots](#-screenshots)

</div>

---

## 🌟 Highlights

- ✅ **50+ Features** - Complete shopping & admin experience
- ✅ **Production Ready** - Secure, scalable, and optimized
- ✅ **Modern Design** - Professional UI with Tailwind CSS
- ✅ **Real Products** - 15 products with Unsplash images
- ✅ **Mobile First** - Fully responsive design
- ✅ **Comprehensive Docs** - 10 documentation files

---

## ✨ Features

### 🛒 Customer Features
- Browse products with advanced filters & search
- Product details with image gallery & ratings
- Wishlist with persistence
- Shopping cart with real-time updates
- Secure checkout with Indian address format
- Order history & tracking
- User profile & account management
- Password strength validation

### 👨‍💼 Admin Features
- Dashboard with key metrics
- Product management (CRUD operations)
- Customer management (block/unblock)
- Order management (status updates)
- Real-time inventory tracking

### 🔧 Technical Features
- JWT authentication & authorization
- Role-based access control (RBAC)
- Redux Toolkit state management
- Cart & wishlist persistence
- Skeleton loaders for better UX
- Toast notifications
- Protected routes
- SEO optimization

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Installation

```bash
# 1. Navigate to project
cd Genwear

# 2. Install dependencies
cd server && npm install
cd ../client && npm install

# 3. Configure environment variables
# Copy .env.example to .env in both server and client
# Update with your MongoDB URI and other credentials

# 4. Seed database
cd server && npm run seed

# 5. Start development servers
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev

# 6. Access application
# Frontend: http://localhost:5173
# Admin: admin@genwear.com / Admin@123
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[COMPLETE_GUIDE.md](COMPLETE_GUIDE.md)** | 📖 Master guide covering everything |
| **[QUICK_START.md](QUICK_START.md)** | ⚡ 5-minute testing guide |
| **[BUILD_SUMMARY.md](BUILD_SUMMARY.md)** | 📋 Complete feature list |
| **[DESIGN_GUIDE.md](DESIGN_GUIDE.md)** | 🎨 Design system documentation |
| **[DEPLOYMENT.md](DEPLOYMENT.md)** | 🚀 Deployment instructions |
| **[TESTING_CHECKLIST.md](TESTING_CHECKLIST.md)** | ✅ 200+ test cases |
| **[API_DOCUMENTATION.md](COMPLETE_GUIDE.md#-api-documentation)** | 📡 API endpoints reference |

---

## 🛠️ Tech Stack

### Frontend
- **React 18+** - UI library
- **Vite** - Build tool
- **Redux Toolkit** - State management
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **React Icons** - Icons

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Cloudinary** - Image hosting

### Design
- **Playfair Display** - Headings
- **Inter** - Body text
- **Outfit** - Display text
- **Tailwind CSS** - Utility-first CSS

---

## 📁 Project Structure

```
Genwear/
├── client/              # React frontend
│   ├── src/
│   │   ├── app/        # Redux store
│   │   ├── features/   # Redux slices (6)
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components (16+)
│   │   └── utils/      # Utilities
│   └── ...
├── server/              # Express backend
│   ├── config/         # Configuration
│   ├── models/         # Mongoose models (4)
│   ├── controllers/    # Route controllers (4)
│   ├── routes/         # API routes (4)
│   ├── middleware/     # Custom middleware
│   └── data/           # Seed data
└── docs/               # Documentation (10 files)
```

---

## 🎨 Design System

### Colors
```
Primary:    #0F172A (Slate 900)
Background: #F8FAFC (Slate 50)
Accent:     #DC2626 (Red 600)
Success:    #10B981 (Emerald 500)
```

### Typography
- **Headings:** Playfair Display (Serif)
- **Body:** Inter (Sans-serif)
- **Display:** Outfit (Geometric)

### Components
- Custom buttons (primary, secondary, accent)
- Card variants (standard, elevated)
- Form inputs with validation
- Status badges
- Skeleton loaders

---

## 📸 Screenshots

### Customer Experience
- **Home Page** - Hero banner, categories, new arrivals
- **Products** - Grid layout with filters & search
- **Product Details** - Image gallery, ratings, add to cart
- **Cart Drawer** - Slide-in cart with quantity controls
- **Checkout** - Shipping form with validation
- **Orders** - Order history with status tracking

### Admin Portal
- **Dashboard** - Metrics and quick actions
- **Products** - CRUD operations with modal forms
- **Customers** - List with block/unblock
- **Orders** - Status management

---

## 🔐 Security

- ✅ JWT authentication with 7-day expiry
- ✅ bcrypt password hashing (10 salt rounds)
- ✅ Role-based access control
- ✅ Protected API routes
- ✅ Input validation
- ✅ CORS configuration
- ✅ Helmet security headers
- ✅ XSS protection

---

## 📊 Statistics

| Metric | Count |
|--------|-------|
| **Total Files** | 45+ |
| **Lines of Code** | ~5,500+ |
| **Features** | 50+ |
| **API Endpoints** | 15+ |
| **Pages/Routes** | 16+ |
| **Redux Slices** | 6 |
| **Products** | 15 (seeded) |
| **Documentation** | 10 files |

---

## 🧪 Testing

### Manual Testing
```bash
# See TESTING_CHECKLIST.md for complete list

# Quick test scenarios:
1. Customer Flow: Register → Browse → Cart → Checkout → Orders
2. Admin Flow: Login → Dashboard → Manage Products/Customers/Orders
3. Wishlist: Add → View → Remove
4. Search & Filters: Category, Price, Sort
```

### Test Credentials
- **Admin:** admin@genwear.com / Admin@123
- **Customer:** Register your own account

---

## 🚀 Deployment

### Recommended Stack
- **Frontend:** Vercel / Netlify
- **Backend:** Render / Railway
- **Database:** MongoDB Atlas
- **Images:** Cloudinary

### Quick Deploy
```bash
# 1. Set up MongoDB Atlas
# 2. Configure environment variables
# 3. Deploy backend to Render
# 4. Deploy frontend to Vercel
# 5. Seed production database

# See DEPLOYMENT.md for detailed instructions
```

---

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Failed**
```bash
# Check if MongoDB is running
# Verify MONGO_URI in .env
# Check IP whitelist (Atlas)
```

**CORS Error**
```bash
# Update CLIENT_URL in server/.env
# Restart backend server
```

**Port Already in Use**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

See [COMPLETE_GUIDE.md](COMPLETE_GUIDE.md#-troubleshooting) for more solutions.

---

## 🔮 Future Enhancements

### Planned Features
- [ ] Payment gateway integration (Stripe/Razorpay)
- [ ] Review submission & display
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Multi-currency support
- [ ] AI-powered recommendations
- [ ] Mobile app (React Native)
- [ ] Progressive Web App (PWA)

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get customer orders
- `GET /api/orders/all` - Get all orders (Admin)
- `PUT /api/orders/:id/status` - Update status (Admin)

### Admin
- `GET /api/admin/dashboard` - Get dashboard data
- `GET /api/admin/customers` - Get all customers
- `PUT /api/admin/customers/:id/block` - Block/unblock customer

See [COMPLETE_GUIDE.md](COMPLETE_GUIDE.md#-api-documentation) for detailed API docs.

---

## 🎯 Best Practices

### Code Quality
- ✅ Feature-based folder structure
- ✅ Consistent naming conventions
- ✅ Modular components
- ✅ Reusable utilities
- ✅ Comprehensive comments

### Performance
- ✅ Database indexes
- ✅ Pagination
- ✅ Optimized images
- ✅ Redux memoization
- ✅ Lazy loading ready

### Accessibility
- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Focus states
- ✅ AAA color contrast

---

## 🤝 Contributing

This is a portfolio project, but suggestions are welcome!

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Author

**GENWEAR Team**

- Portfolio: [Your Portfolio]
- LinkedIn: [Your LinkedIn]
- GitHub: [Your GitHub]

---

## 🙏 Acknowledgments

- **Unsplash** - Product images
- **Google Fonts** - Typography
- **React Icons** - Icon library
- **Tailwind CSS** - Styling framework
- **MongoDB** - Database
- **Vercel** - Hosting

---

## 📞 Support

For support, email support@genwear.com or open an issue.

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

**Built with ❤️ using MERN Stack**

![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-6+-47A248?style=flat-square&logo=mongodb)
![Tailwind](https://img.shields.io/badge/Tailwind-3+-06B6D4?style=flat-square&logo=tailwindcss)

**Version 2.0** | **Production Ready** ✅

[Documentation](COMPLETE_GUIDE.md) • [Quick Start](QUICK_START.md) • [Deployment](DEPLOYMENT.md)

</div>
