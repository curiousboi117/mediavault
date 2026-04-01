import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { PORT } from './config/constants.js';
import mediaRoutes from './routes/mediaRoutes.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true
}));

app.use('/uploads', express.static(path.resolve('backend/uploads')));
app.use('/api', mediaRoutes);

app.use((err, _req, res, _next) => {
  const message = err.message || 'Server error';
  const status = message.startsWith('Unsupported file type') ? 400 : 500;
  res.status(status).json({ message });
});

app.listen(PORT, () => {
  console.log(`MediaVault API listening on http://localhost:${PORT}`);
});
