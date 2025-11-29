import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import cors from "cors";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import seriesRoutes from './routes/seriesRoute.js';
import favoriteRoutes from './routes/favoriteRoute.js';
import reviewRoutes from './routes/reviewRoute.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Error handling untuk JSON parsing
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON format' });
  }
  next();
});

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log('Content-Type:', req.get('content-type'));
  console.log('Body:', req.body);
  next();
});

// API Routes
app.use('/api/series', seriesRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/reviews', reviewRoutes);

// Serve static files from dist (production build)
const distPath = join(__dirname, '../../dist');
app.use(express.static(distPath));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(join(distPath, 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

