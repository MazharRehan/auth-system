/**
 * Role-based access control middleware
 * @param {...string} allowedRoles - Allowed roles for the endpoint
 * @returns {Function} Express middleware function
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user is authenticated (should be called after authenticate middleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check if user role is allowed
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

/**
 * Admin only access middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const adminOnly = authorize('admin');

/**
 * Admin and moderator access middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const adminOrModerator = authorize('admin', 'moderator');

/**
 * Check if user can access their own resource or is admin/moderator
 * @param {string} userIdParam - Parameter name containing user ID (default: 'userId')
 * @returns {Function} Express middleware function
 */
const ownResourceOrAdmin = (userIdParam = 'userId') => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const targetUserId = req.params[userIdParam];
    const currentUserId = req.user._id.toString();
    const userRole = req.user.role;

    // Allow if user is accessing their own resource
    if (targetUserId === currentUserId) {
      return next();
    }

    // Allow if user is admin or moderator
    if (['admin', 'moderator'].includes(userRole)) {
      return next();
    }

    // Deny access
    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only access your own resources.'
    });
  };
};

/**
 * Check if user can modify their own resource or is admin
 * @param {string} userIdParam - Parameter name containing user ID (default: 'userId')
 * @returns {Function} Express middleware function
 */
const ownResourceOrAdminModify = (userIdParam = 'userId') => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const targetUserId = req.params[userIdParam];
    const currentUserId = req.user._id.toString();
    const userRole = req.user.role;

    // Allow if user is accessing their own resource
    if (targetUserId === currentUserId) {
      return next();
    }

    // Allow only admins to modify other users' resources
    if (userRole === 'admin') {
      return next();
    }

    // Deny access
    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only modify your own resources or must be an admin.'
    });
  };
};

/**
 * Role hierarchy middleware - checks if user has sufficient role level
 * Role hierarchy: user < moderator < admin
 * @param {string} minimumRole - Minimum role required
 * @returns {Function} Express middleware function
 */
const requireMinimumRole = (minimumRole) => {
  const roleHierarchy = {
    'user': 1,
    'moderator': 2,
    'admin': 3
  };

  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userRoleLevel = roleHierarchy[req.user.role] || 0;
    const requiredRoleLevel = roleHierarchy[minimumRole] || 0;

    if (userRoleLevel < requiredRoleLevel) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Minimum role required: ${minimumRole}`
      });
    }

    next();
  };
};

module.exports = {
  authorize,
  adminOnly,
  adminOrModerator,
  ownResourceOrAdmin,
  ownResourceOrAdminModify,
  requireMinimumRole
};