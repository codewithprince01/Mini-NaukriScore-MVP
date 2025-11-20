import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import scoreRoutes from './routes/scoreRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
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
