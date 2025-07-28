const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
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