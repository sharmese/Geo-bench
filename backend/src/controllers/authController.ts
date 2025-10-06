import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { Request, Response } from 'express';
import * as authService from '../services/authService';
import {
  generateAccessToken,
  verifyRefreshToken,
} from '../services/authService';

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .send({ message: 'Missing required fields: username, email, password.' });
  }

  try {
    const newUser = await authService.registerUser({
      username,
      email,
      password_hash: password,
    });
    const { password_hash, ...userData } = newUser;
    res.status(201).send(userData);
  } catch (error) {
    res
      .status(409)
      .send({ message: 'User with this email or username already exists.' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const tokens = await authService.authenticateUser(email, password);
    if (!tokens) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.cookie('jwt_refresh', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      domain: 'sharmese.dev',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      accessToken: tokens.accessToken,
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Login failed' });
  }
};
export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  try {
    const user = await authService.getUserById(userId);
    if (user) {
      const { password_hash, ...userData } = user;
      res.send(userData);
    } else {
      res.status(404).send({ message: 'User not found.' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Could not retrieve user profile.' });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const oldRefreshToken = req.cookies.jwt_refresh;

  if (!oldRefreshToken) {
    return res.status(401).send({ message: 'Refresh Token not found.' });
  }
  const payload = verifyRefreshToken(oldRefreshToken);

  if (!payload || !payload.userId) {
    return res
      .status(403)
      .send({ message: 'Invalid or expired Refresh Token.' });
  }

  const newAccessToken = generateAccessToken({ userId: payload.userId });

  res.json({ accessToken: newAccessToken });
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie('jwt_refresh', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      domain: 'sharmese.dev',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Logout failed' });
  }
};
