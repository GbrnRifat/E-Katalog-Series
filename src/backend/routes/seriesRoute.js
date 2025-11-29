import express from 'express';
import { SeriesController } from '../controllers/seriesController.js';
const router = express.Router();

// POST endpoint - Create new series (harus sebelum :id routes)
router.post('/', SeriesController.create);

// GET endpoints
router.get('/', SeriesController.all);
router.get('/search', SeriesController.search);
router.get('/:id', SeriesController.detail);

// PUT endpoint - Update series
router.put('/:id', SeriesController.update);

// DELETE endpoint - Delete series
router.delete('/:id', SeriesController.delete);

export default router;
