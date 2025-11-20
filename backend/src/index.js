import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import scoreRoutes from './routes/scoreRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  process.env.FRONTEND_URL || 'https://mini-naukri-score-mvp.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow non-browser clients or same-origin calls
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    }
  })
);

// Handle preflight for all routes
app.options('*', cors());
app.use(express.json());

connectDB();

app.use('/', authRoutes);
app.use('/', scoreRoutes);

app.get('/', (req, res) => {
  res.send('Mini NaukriScore API running');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
