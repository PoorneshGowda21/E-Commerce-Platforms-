import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isMongoConnected } from '../config/db.js';
import { mockUsers } from '../controllers/authController.js';

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key', {
    expiresIn: '30d',
  });
};

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'fallback_secret_key'
      );

      // Check MongoDB if connected
      if (isMongoConnected()) {
        try {
          req.user = await User.findById(decoded.id).select('-password');
        } catch (e) {
          // Fall through to in-memory check
        }
      }

      // If not found in DB or DB offline, check in-memory store
      if (!req.user) {
        const fallbackUser = mockUsers.find(
          (u) => u._id.toString() === decoded.id.toString()
        );
        if (fallbackUser) {
          req.user = {
            _id: fallbackUser._id,
            name: fallbackUser.name,
            email: fallbackUser.email,
            role: fallbackUser.role,
          };
        }
      }

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error('Auth verification error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin privileges required' });
  }
};
