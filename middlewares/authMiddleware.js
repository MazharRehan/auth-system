/* Middlewares are functions that run before the final request handler.
They can modify the request, response, or perform actions before the request reaches the final handler.
This middleware is used to protect routes by verifying JWT tokens.
It checks if the user is authenticated and has access to the requested resource.
 */
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// protect middleware - checks if the user is authenticated
// It verifies the JWT token and attaches the user to the request object
const protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        // console.log('Token:', token);
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Please login to access this resource'
            });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user || user.isDeleted) {
            return res.status(401).json({
                success: false,
                message: 'User not found or access revoked'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid token or token expired'
        });
    }
};

module.exports = { protect };