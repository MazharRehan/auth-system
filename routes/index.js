/* 
Routes refers to the API endpoints of the application.
It is a mechanism to define how the application responds to client requests.
 - Routes folder is used to define all API routes
 - This file serves as the main entry point for API routes
*/

const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');

// Test route
router.get('/test', (req, res) => {
    res.json({
        message: 'API is working',
        timestamp: new Date().toISOString()
    });
});

// Mount routes - this allows us to group related routes together
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

// For future route additions
// router.use('/admin', adminRoutes);

// Handle 404 for API routes
router.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
    });
});


module.exports = router;