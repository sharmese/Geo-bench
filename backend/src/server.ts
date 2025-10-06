import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import { initializeDatabase } from './db';
import { protect } from './middleware/authMiddleware';
import markerRoutes from './routes/markerRoutes';
import cookieParser from 'cookie-parser';

dotenv.config();

const port = process.env.PORT || 5000;
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
const allowedOrigins = [
  'https://sharmese.dev',
  process.env.FRONTEND_URL,
].filter((origin): origin is string => typeof origin === 'string');

const corsOptions = {
  origin: 'https://sharmese.dev',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Access-Control-Allow-Credentials',
  ],
  exposedHeaders: ['Set-Cookie'],
  preflightContinue: true,
  optionsSuccessStatus: 204,
};

const app = express();

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  console.log('Received GET request on /');
  res.send('Backend is running!');
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/markers', markerRoutes);
app.get('/api/v1/protected-test', protect, (req, res) => {
  res.json({
    message: 'Access granted!',
    userId: (req as any).userId,
  });
});

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error('--- UNHANDLED ERROR ---');
    console.error(err.stack);
    console.error('-------------------------------------');
    res.status(500).send('Internal Server Error');
  }
);

async function startApplication() {
  try {
    await initializeDatabase();

    app.listen(port, () => {
      console.log(`Backend server running on port ${port}`);
      console.log(`CORS allowed origin: ${frontendUrl}`);
    });
  } catch (error) {
    console.error('FATAL: Failed to start application due to database error.');
    process.exit(1);
  }
}

startApplication();
