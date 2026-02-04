# GENWEAR API Documentation v2.0.0

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Products Endpoints

### Get All Products
```
GET /products
```

**Query Parameters:**
- `gender` - Filter by gender (men, women, kids, unisex)
- `category` - Filter by category (topwear, bottomwear, outerwear, accessories)
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `search` - Search by name or description
- `sort` - Sort by (price, rating, newest)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)

**Example:**
```
GET /products?gender=men&category=topwear&sort=price&limit=20
```

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Products fetched successfully",
  "data": {
    "products": [...],
    "total": 100,
    "page": 1,
    "totalPages": 5
  }
}
```

### Get Single Product
```
GET /products/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "product_id",
    "name": "Product Name",
    "price": 2999,
    "description": "Product description",
    "images": [...],
    "colors": [...],
    "sizes": [...],
    "stock": 50
  }
}
```

### Search Products
```
GET /products/search?q=shirt
```

---

## Authentication Endpoints

### Register
```
POST /auth/register
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "_id": "user_id",
  "firstName": "John",
  "email": "john@example.com",
  "token": "jwt_token"
}
```

### Login
```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "_id": "user_id",
  "firstName": "John",
  "email": "john@example.com",
  "role": "user",
  "token": "jwt_token"
}
```

---

## Cart Endpoints (Protected)

### Get Cart
```
GET /cart
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "cart_id",
    "user": "user_id",
    "items": [
      {
        "_id": "item_id",
        "product": "product_id",
        "quantity": 2,
        "size": "M",
        "color": "Black"
      }
    ]
  }
}
```

### Add to Cart
```
POST /cart
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "productId": "product_id",
  "quantity": 2,
  "size": "M",
  "color": "Black"
}
```

### Update Cart Item
```
PUT /cart/:itemId
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "quantity": 3
}
```

### Remove from Cart
```
DELETE /cart/:itemId
Authorization: Bearer <token>
```

---

## Orders Endpoints (Protected)

### Create Order
```
POST /orders
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "orderItems": [
    {
      "product": "product_id",
      "quantity": 2,
      "price": 2999
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "credit_card",
  "pricing": {
    "subtotal": 5998,
    "shipping": 100,
    "tax": 600,
    "total": 6698
  }
}
```

### Get My Orders
```
GET /orders/myorders
Authorization: Bearer <token>
```

### Get Order Details
```
GET /orders/:orderId
Authorization: Bearer <token>
```

---

## Admin Endpoints (Admin Only)

### Get All Users
```
GET /admin/users
Authorization: Bearer <admin_token>
```

### Get Dashboard Stats
```
GET /admin/stats
Authorization: Bearer <admin_token>
```

### Create Product
```
POST /admin/products
Authorization: Bearer <admin_token>
```

### Update Product
```
PUT /admin/products/:productId
Authorization: Bearer <admin_token>
```

### Delete Product
```
DELETE /admin/products/:productId
Authorization: Bearer <admin_token>
```

---

## Health Check

### API Health
```
GET /health
```

**Response:**
```json
{
  "status": "success",
  "message": "GENWEAR API is running",
  "version": "2.0.0",
  "timestamp": "2026-01-24T12:00:00.000Z"
}
```

---

## Error Responses

### Standard Error Response
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message here",
  "timestamp": "2026-01-24T12:00:00.000Z"
}
```

### Validation Error
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": {
    "email": "Invalid email format",
    "password": "Password too short"
  }
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Success |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

---

## Rate Limiting

API endpoints are rate-limited to **100 requests per 15 minutes** per IP address.

When rate limited, you'll receive:
```
HTTP 429 Too Many Requests
```

---

## Changelog

### v2.0.0 (January 24, 2026)
- ✅ Enhanced error handling
- ✅ Added rate limiting
- ✅ Improved security with helmet
- ✅ Added compression
- ✅ Better request validation
- ✅ Comprehensive logging
- ✅ API documentation

### v1.0.0 (Initial Release)
- Basic CRUD operations
- Authentication system
- Cart and order management
