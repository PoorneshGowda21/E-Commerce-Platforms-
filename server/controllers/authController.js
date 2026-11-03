import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import { isMongoConnected } from '../config/db.js';

// Pre-configured in-memory users for resilience
export const mockUsers = [
  {
    _id: '67c570000000000000000001',
    name: 'Store Administrator',
    email: 'admin@store.com',
    password: 'admin123',
    role: 'admin',
    createdAt: new Date(),
  },
  {
    _id: '67c570000000000000000002',
    name: 'Alex Johnson',
    email: 'customer@store.com',
    password: 'customer123',
    role: 'customer',
    createdAt: new Date(),
  },
];

// @desc    Register a new customer account
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (isMongoConnected()) {
      try {
        const userExists = await User.findOne({ email: cleanEmail });
        if (userExists) {
          return res.status(400).json({ message: 'An account with this email already exists' });
        }

        const user = await User.create({
          name,
          email: cleanEmail,
          password,
          role: 'customer',
        });

        return res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
        });
      } catch (dbErr) {
        console.warn('DB register fallback:', dbErr.message);
      }
    }

    // In-memory fallback
    const existing = mockUsers.find((u) => u.email === cleanEmail);
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const newUser = {
      _id: '67c57' + Date.now().toString(16).padStart(19, '0').slice(0, 19),
      name,
      email: cleanEmail,
      password,
      role: 'customer',
      createdAt: new Date(),
    };
    mockUsers.push(newUser);

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      token: generateToken(newUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate customer or admin & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (isMongoConnected()) {
      try {
        const user = await User.findOne({ email: cleanEmail });
        if (user && (await user.matchPassword(password))) {
          return res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
          });
        }
      } catch (dbErr) {
        console.warn('DB login fallback:', dbErr.message);
      }
    }

    // In-memory fallback
    const user = mockUsers.find(
      (u) => u.email === cleanEmail && u.password === password
    );

    if (user) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    }

    res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate ADMIN only & get token
// @route   POST /api/auth/admin-login
// @access  Public (Dedicated Admin Gateway)
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (isMongoConnected()) {
      try {
        const user = await User.findOne({ email: cleanEmail });
        if (user) {
          if (!(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid admin credentials' });
          }
          if (user.role !== 'admin') {
            return res.status(403).json({
              message: 'Access Denied: This portal is strictly restricted to administrative staff.',
            });
          }
          return res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
          });
        }
      } catch (dbErr) {
        console.warn('DB admin login fallback:', dbErr.message);
      }
    }

    // In-memory fallback
    const admin = mockUsers.find((u) => u.email === cleanEmail && u.role === 'admin');
    if (!admin || admin.password !== password) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    if (isMongoConnected()) {
      try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) return res.json(user);
      } catch (e) {
        // Fall through
      }
    }

    const user = mockUsers.find((u) => u._id.toString() === req.user._id.toString());
    if (user) {
      const { password, ...rest } = user;
      return res.json(rest);
    }
    res.status(404).json({ message: 'User not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (for Admin Dashboard)
// @route   GET /api/auth/users
// @access  Private / Admin
export const getAllUsers = async (req, res) => {
  try {
    if (isMongoConnected()) {
      try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        return res.json(users);
      } catch (e) {
        // Fall through
      }
    }

    const users = mockUsers.map(({ password, ...u }) => u);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
