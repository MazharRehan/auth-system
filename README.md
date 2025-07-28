# Auth System API Documentation

A secure authentication system with JWT tokens and role-based access control.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Environment Setup](#environment-setup)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Security Features](#security-features)

## Overview

This authentication system provides a complete solution for user management with JWT-based authentication and role-based access control. It includes user registration, login, token refresh, and comprehensive user management features.

## Features

- ✅ User Registration and Login
- ✅ JWT Access Tokens (15 minutes) and Refresh Tokens (7 days)
- ✅ Role-Based Access Control (User, Moderator, Admin)
- ✅ Password Hashing with bcrypt
- ✅ Token Blacklisting via Refresh Token Management
- ✅ Input Validation and Sanitization
- ✅ Rate Limiting and Security Headers
- ✅ User Profile Management
- ✅ Admin User Management
- ✅ Comprehensive Error Handling

## Environment Setup

Create a `.env` file based on `.env.example`:

```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/auth-system

# JWT Configuration
JWT_ACCESS_SECRET=your-super-secret-access-token-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-token-key-here
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Security
BCRYPT_SALT_ROUNDS=12
```

## API Endpoints

### Authentication Routes

#### POST `/api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "role": "user" // optional: user, moderator (admin can only be set by another admin)
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isActive": true,
      "createdAt": "...",
      "updatedAt": "..."
    },
    "tokens": {
      "accessToken": "...",
      "refreshToken": "...",
      "tokenType": "Bearer",
      "expiresIn": "15m"
    }
  }
}
```

#### POST `/api/auth/login`
Login an existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response:** Same as registration response.

#### POST `/api/auth/refresh-token`
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "your-refresh-token"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "tokens": {
      "accessToken": "...",
      "refreshToken": "...",
      "tokenType": "Bearer",
      "expiresIn": "15m"
    }
  }
}
```

#### POST `/api/auth/logout`
Logout user by invalidating refresh token.

**Request Body:**
```json
{
  "refreshToken": "your-refresh-token"
}
```

#### GET `/api/auth/profile` 🔒
Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <access-token>
```

#### PUT `/api/auth/profile` 🔒
Update current user profile (requires authentication).

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

#### POST `/api/auth/logout-all` 🔒
Logout from all devices (invalidates all refresh tokens).

### User Management Routes (Admin/Moderator)

#### GET `/api/users` 🔒👮
Get all users with pagination (Admin/Moderator only).

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `role` (optional): Filter by role (user, moderator, admin)
- `isActive` (optional): Filter by active status (true/false)

#### GET `/api/users/:userId` 🔒👮
Get user by ID (Admin/Moderator only).

#### PATCH `/api/users/:userId/role` 🔒👑
Update user role (Admin only).

**Request Body:**
```json
{
  "role": "moderator"
}
```

#### PATCH `/api/users/:userId/status` 🔒👑
Activate/Deactivate user (Admin only).

**Request Body:**
```json
{
  "isActive": false
}
```

#### DELETE `/api/users/:userId` 🔒👑
Delete user (Admin only).

## Authentication

The system uses JWT (JSON Web Tokens) for authentication:

1. **Access Token**: Short-lived token (15 minutes) for API access
2. **Refresh Token**: Long-lived token (7 days) for obtaining new access tokens

### Token Usage

Include the access token in the Authorization header:

```
Authorization: Bearer <access-token>
```

### Token Refresh Flow

1. When access token expires, use refresh token to get new tokens
2. The refresh token is rotated (old one invalidated, new one issued)
3. Store tokens securely on the client side

## Role-Based Access Control

### Roles

- **User**: Basic user with access to their own profile
- **Moderator**: Can view user information
- **Admin**: Full access to user management

### Permission Matrix

| Action | User | Moderator | Admin |
|--------|------|-----------|-------|
| View own profile | ✅ | ✅ | ✅ |
| Update own profile | ✅ | ✅ | ✅ |
| View all users | ❌ | ✅ | ✅ |
| View any user | ❌ | ✅ | ✅ |
| Update user roles | ❌ | ❌ | ✅ |
| Activate/Deactivate users | ❌ | ❌ | ✅ |
| Delete users | ❌ | ❌ | ✅ |

## Error Handling

### Standard Error Response

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Optional: validation errors
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate email)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

## Security Features

### Password Security
- Minimum 6 characters
- Must contain uppercase, lowercase, and number
- Hashed using bcrypt with 12 salt rounds

### Token Security
- JWT tokens with proper expiration
- Refresh token rotation
- Token blacklisting through database storage

### API Security
- Helmet.js for security headers
- CORS configuration
- Rate limiting (100 requests per 15 minutes)
- Input sanitization (MongoDB injection, XSS)
- Request validation using express-validator

### Database Security
- MongoDB injection prevention
- Indexed fields for performance
- Proper error handling without data leakage

## Validation Rules

### Registration
- Name: 2-100 characters, letters and spaces only
- Email: Valid email format
- Password: Min 6 chars, uppercase + lowercase + number
- Role: Optional, user or moderator only

### Login
- Email: Valid email format
- Password: Required

### Profile Update
- Name: 2-100 characters, letters and spaces only (optional)
- Email: Valid email format (optional)

## Example Usage

### Complete Authentication Flow

```javascript
// 1. Register
const registerResponse = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'SecurePass123'
  })
});

const { data } = await registerResponse.json();
const { accessToken, refreshToken } = data.tokens;

// 2. Access protected route
const profileResponse = await fetch('/api/auth/profile', {
  headers: { 'Authorization': `Bearer ${accessToken}` }
});

// 3. Refresh token when access token expires
const refreshResponse = await fetch('/api/auth/refresh-token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ refreshToken })
});

// 4. Logout
const logoutResponse = await fetch('/api/auth/logout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ refreshToken })
});
```

## Icons Legend
- 🔒 Requires authentication
- 👮 Requires moderator or admin role
- 👑 Requires admin role