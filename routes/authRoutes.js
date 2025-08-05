// authRoutes.js - handles user authentication routes
const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Input validation middleware for registration
router.post('/register', [
    body('name').notEmpty().trim()
        .withMessage('Name is required'),
    body('email').isEmail().normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
], authController.register);

// Login route
router.post('/login', [
    body('email').isEmail().normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password').notEmpty()
        .withMessage('Password is required')
], authController.login);

// Protected logout route
router.post('/logout', protect, authController.logout);

module.exports = router;