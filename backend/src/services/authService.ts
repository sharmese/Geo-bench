import { dbQuery } from '../db/query';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { NewUser, User } from '../models/User';
interface TokenPayload extends JwtPayload {
  userId: number;
}
const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'default_refresh';
const SALT_ROUNDS = 10;

export async function registerUser(data: NewUser): Promise<User> {
  const hashedPassword = await bcrypt.hash(data.password_hash, SALT_ROUNDS);

  const sql = `
    INSERT INTO users (username, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, username, email, created_at;
  `;
  const values = [data.username, data.email, hashedPassword];

  try {
    const result = await dbQuery(sql, values);
    return result.rows[0] as User;
  } catch (error) {
    console.error('Database error during registration:', error);
    throw new Error('Registration failed.');
  }
}
export function generateAccessToken(payload: { userId: number }): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '15m',
  });
}
export function generateRefreshToken(payload: { userId: number }): string {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: '7d',
  });
}
export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, REFRESH_SECRET) as TokenPayload;

    return decoded;
  } catch (error) {
    return null;
  }
}
export async function authenticateUser(
  email: string,
  password_plain: string
): Promise<{ accessToken: string; refreshToken: string } | null> {
  const sql = 'SELECT id, password_hash FROM users WHERE email = $1';
  const result = await dbQuery(sql, [email]);
  const user = result.rows[0];

  if (!user) {
    return null;
  }

  const isMatch = await bcrypt.compare(password_plain, user.password_hash);

  if (isMatch) {
    const payload = { userId: user.id };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { accessToken, refreshToken };
  }

  return null;
}
export async function getUserById(userId: number): Promise<User | null> {
  const sql = 'SELECT id, username, email, created_at FROM users WHERE id = $1';
  const result = await dbQuery(sql, [userId]);
  return result.rows[0] || null;
}
