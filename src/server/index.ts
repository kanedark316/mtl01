import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from '../config/db';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import adminRoutes from './routes/admin';
import Admin from '../models/Admin';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Create default super admin on startup
Admin.createDefaultSuperAdmin();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});