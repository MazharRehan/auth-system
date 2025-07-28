const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * Generate JWT access token
 * @param {string} userId - User ID
 * @param {string} email - User email
 * @param {string} role - User role
 * @returns {string} JWT access token
 */
const generateAccessToken = (userId, email, role) => {
  const payload = {
    id: userId,
    email,
    role,
    type: 'access'
  };

  const options = {
    expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m',
    issuer: 'auth-system',
    audience: 'auth-system-users'
  };

  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, options);
};

/**
 * Generate JWT refresh token
 * @param {string} userId - User ID
 * @returns {string} JWT refresh token
 */
const generateRefreshToken = (userId) => {
  const payload = {
    id: userId,
    type: 'refresh',
    tokenId: crypto.randomBytes(16).toString('hex') // Unique token identifier
  };

  const options = {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
    issuer: 'auth-system',
    audience: 'auth-system-users'
  };

  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, options);
};

/**
 * Generate both access and refresh tokens
 * @param {Object} user - User object
 * @returns {Object} Object containing access and refresh tokens
 */
const generateTokens = (user) => {
  const accessToken = generateAccessToken(user._id, user.email, user.role);
  const refreshToken = generateRefreshToken(user._id);

  return {
    accessToken,
    refreshToken,
    tokenType: 'Bearer',
    expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m'
  };
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @param {string} secret - JWT secret to use for verification
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret, {
      issuer: 'auth-system',
      audience: 'auth-system-users'
    });
  } catch (error) {
    throw new Error('Invalid token');
  }
};

/**
 * Verify access token
 * @param {string} token - Access token to verify
 * @returns {Object} Decoded token payload
 */
const verifyAccessToken = (token) => {
  return verifyToken(token, process.env.JWT_ACCESS_SECRET);
};

/**
 * Verify refresh token
 * @param {string} token - Refresh token to verify
 * @returns {Object} Decoded token payload
 */
const verifyRefreshToken = (token) => {
  return verifyToken(token, process.env.JWT_REFRESH_SECRET);
};

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} Extracted token or null
 */
const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // Remove "Bearer " prefix
};

/**
 * Get token expiration time
 * @param {string} token - JWT token
 * @returns {Date|null} Expiration date or null if invalid
 */
const getTokenExpiration = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (decoded && decoded.exp) {
      return new Date(decoded.exp * 1000);
    }
    return null;
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
  verifyToken,
  verifyAccessToken,
  verifyRefreshToken,
  extractTokenFromHeader,
  getTokenExpiration
};