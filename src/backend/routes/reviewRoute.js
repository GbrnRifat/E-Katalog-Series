import express from 'express';
import { ReviewController } from '../controllers/reviewController.js';
const router = express.Router();

// POST endpoint - Add/create review
router.post('/', ReviewController.add);
router.post('/add', ReviewController.add);

// GET endpoint - Get all reviews for a series
router.get('/:series_id', ReviewController.getSeriesReviews);

export default router;
