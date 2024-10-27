import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../../models/Admin';
import auth from '../middleware/auth';
import { checkPermission } from '../middleware/adminPermissions';

const router = express.Router();

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    const token = jwt.sign(
      { 
        adminId: admin._id,
        role: admin.role,
        permissions: admin.permissions
      },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '8h' }
    );

    res.json({ 
      token, 
      role: admin.role, 
      permissions: admin.permissions 
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;