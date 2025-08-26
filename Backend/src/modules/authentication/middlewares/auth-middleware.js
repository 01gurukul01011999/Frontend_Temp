const authService = require('../services/auth-service');

// Authentication middleware
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify token and get user
    const user = await authService.getUserByToken(token);
    
    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.message === 'Invalid or expired token') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const user = await authService.getUserByToken(token);
      req.user = user;
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Role-based access control middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.roll)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

// Account status check middleware
const requireAccountComplete = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.user.ac_sta !== 'done') {
    return res.status(403).json({ error: 'Account setup incomplete' });
  }

  next();
};

module.exports = {
  authenticateUser,
  optionalAuth,
  requireRole,
  requireAccountComplete,
};
