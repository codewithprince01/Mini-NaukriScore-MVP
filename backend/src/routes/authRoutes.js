import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

const router = express.Router();

// 1) POST /register
router.post('/register', async (req, res) => {
  try {
    const { Name, Email, Password } = req.body;

    if (!Name || !Email || !Password) {
      return res.status(400).json({ message: 'Name, Email and Password are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (Password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const existing = await User.findOne({ Email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const user = await User.create({ Name, Email, Password: hashedPassword });

    return res.status(201).json({ user_id: user._id.toString() });
  } catch (error) {
    console.error('Error in /register:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// 2) POST /login
router.post('/login', async (req, res) => {
  try {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
      return res.status(400).json({ message: 'Email and Password are required' });
    }

    const user = await User.findOne({ Email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return res.json({
      message: 'Login successful',
      user_id: user._id.toString(),
      Name: user.Name,
      Email: user.Email
    });
  } catch (error) {
    console.error('Error in /login:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// 3) POST /logout (stateless placeholder)
router.post('/logout', (req, res) => {
  return res.json({ message: 'Logged out successfully' });
});

export default router;
