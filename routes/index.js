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

// Mount routes
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