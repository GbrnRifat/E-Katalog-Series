import { ReviewModel } from "../models/reviewModel.js";

export const ReviewController = {
  async add(req, res) {
    try {
      console.log('[ReviewController.add] Request body:', JSON.stringify(req.body, null, 2));
      
      let { series_id, user, user_identifier, rating, comment } = req.body;
      
      if (!series_id) {
        console.error('[ReviewController.add] Missing series_id');
        return res.status(400).json({ error: 'series_id is required' });
      }
      
      if (rating === undefined || rating === null) {
        console.error('[ReviewController.add] Missing rating');
        return res.status(400).json({ error: 'rating is required' });
      }

      // Convert rating to integer
      rating = parseInt(rating);
      
      // Validate rating - biasanya antara 0-10
      if (isNaN(rating) || rating < 0 || rating > 10) {
        console.error('[ReviewController.add] Invalid rating:', rating);
        return res.status(400).json({ error: 'Rating must be between 0 and 10' });
      }

      // Gunakan user atau user_identifier, dengan fallback ke default
      const finalUserIdentifier = user || user_identifier || `Anonymous-${Date.now()}`;

      console.log('[ReviewController.add] Creating review:', { series_id, finalUserIdentifier, rating, comment });

      const result = await ReviewModel.addReview(series_id, finalUserIdentifier, rating, comment || null);
      
      console.log('[ReviewController.add] Success:', result);
      res.status(201).json({ 
        message: 'Review created successfully', 
        data: result,
        success: true
      });
    } catch (error) {
      console.error('[ReviewController.add] Error:', error);
      res.status(500).json({ 
        error: error.message || 'Failed to create review',
        details: error.toString()
      });
    }
  },

  async getSeriesReviews(req, res) {
    try {
      const { series_id } = req.params;
      
      if (!series_id) {
        console.error('[ReviewController.getSeriesReviews] Missing series_id');
        return res.status(400).json({ error: 'series_id is required' });
      }

      console.log('[ReviewController.getSeriesReviews] Fetching reviews for series:', series_id);

      const reviews = await ReviewModel.getSeriesReviews(series_id);
      res.json(reviews || []);
    } catch (error) {
      console.error('[ReviewController.getSeriesReviews] Error:', error);
      res.status(500).json({ 
        error: error.message || 'Failed to fetch reviews',
        details: error.toString()
      });
    }
  }
};
