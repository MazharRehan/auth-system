# Authentication & User Management System

A secure, scalable authentication and user management system built with Node.js, Express, and MongoDB.

**Last Updated:** 2025-07-28 11:33:22 UTC  
**Author:** MazharRehan

## Table of Contents
- [Features](#features)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Testing](#testing)
- [Security](#security)

## Features

### Core Features
- User registration and authentication
- JWT-based authentication (access & refresh tokens)
- Role-based access control (RBAC)
- User profile management
- Secure password handling
- Input validation and sanitization

### Security Features
- Password hashing with bcryptjs
- JWT token-based authentication
- Rate limiting
- CORS protection
- XSS protection
- HTTP-only cookies
- Input sanitization

## Project Structure
```
auth-system/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   └── userController.js
├── middlewares/
│   ├── authMiddleware.js
│   └── roleMiddleware.js
├── models/
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   └── index.js
├── utils/
│   └── generateTokens.js
├── .env
├── .gitignore
├── package.json
└── server.js
```

## Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB

### Installation
1. Clone the repository
```bash
git clone https://github.com/MazharRehan/auth-system.git
cd auth-system
```

2. Install dependencies
```bash
npm install
```

3. Create .env file
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/auth-system
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRE=15m
REFRESH_TOKEN_EXPIRE=7d
```

4. Start the server
```bash
npm run dev  # for development
npm start    # for production
```

## API Endpoints

### Public Routes
```
GET /                 - Root endpoint
GET /api/test        - API test endpoint
```

### Authentication Routes
```
POST /api/auth/register   - Register new user
POST /api/auth/login      - Login user
POST /api/auth/logout     - Logout user
```

### Protected Routes
```
GET    /api/users/profile         - Get user profile
PUT    /api/users/profile         - Update user profile
PUT    /api/users/change-password - Change password
DELETE /api/users/delete          - Soft delete user
```

### Admin Routes
```
GET /api/users/all    - Get all users (admin only)
```

## Authentication

### Registration
```http
POST /api/auth/register
Content-Type: application/json

{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "test@example.com",
    "password": "password123"
}
```

### Protected Route Access
```http
GET /api/users/profile
Authorization: Bearer <access_token>
```

## Token Management
- Access Token: 15 minutes expiry
- Refresh Token: 7 days expiry
- Tokens are stored securely using HTTP-only cookies
- Protected routes require valid access token

## Security Implementations
- `helmet` for HTTP headers security
- `cors` for Cross-Origin Resource Sharing
- `express-rate-limit` for rate limiting
- `express-mongo-sanitize` for NoSQL injection prevention
- `xss-clean` for XSS prevention
- JWT secrets stored in environment variables
- Password hashing using bcryptjs

## Testing
Use Postman for API testing:
1. Import the provided Postman collection
2. Set up environment variables:
   - `BASE_URL`: http://localhost:3000
   - `TOKEN`: (automatically set after login)

### Response Format
All endpoints return responses in the following format:
```json
{
    "success": true,
    "message": "Operation successful",
    "data": {
        // Response data
    }
}
```

## Error Handling
```json
{
    "success": false,
    "message": "Error message",
    "error": {
        // Error details (development only)
    }
}
```

## Role-Based Access Control
- Available roles: `admin`, `user`
- Role assignment on registration
- Role-specific middleware for protected routes

## Future Enhancements
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Social login integration
- [ ] OTP-based login
- [ ] Pagination and search for users
- [ ] Activity logging

## License
Mazhar Rehan