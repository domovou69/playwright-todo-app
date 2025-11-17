import { Router, Request, Response } from 'express';
import { getUserByUsername } from '../db/storage.js';
import { generateToken, authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Login endpoint
router.post('/login', (req: Request, res: Response): void => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required' });
      return;
    }

    const user = getUserByUsername(username);

    if (!user || user.password !== password) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = generateToken(user.id);

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user endpoint
router.get('/me', authMiddleware, (req: AuthRequest, res: Response): void => {
  res.json({ user: req.user });
});

// Logout endpoint (client-side token removal)
router.post('/logout', (req: Request, res: Response): void => {
  res.json({ message: 'Logged out successfully' });
});

export default router;
