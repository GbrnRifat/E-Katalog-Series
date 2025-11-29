import apiClient from './api';

class ReviewService {
  /**
   * Get reviews for a series
   */
  async getReviews(seriesId) {
    try {
      console.log('[ReviewService.getReviews] Fetching reviews for series:', seriesId);
      const response = await apiClient.get(`/reviews/${seriesId}`);
      console.log('[ReviewService.getReviews] Response:', response);
      return response;
    } catch (error) {
      console.error('[ReviewService.getReviews] Error:', error);
      throw error;
    }
  }

  /**
   * Create a review
   */
  async createReview(seriesId, reviewData) {
    try {
      const payload = {
        series_id: seriesId,
        ...reviewData
      };
      console.log('[ReviewService.createReview] Sending payload:', JSON.stringify(payload, null, 2));
      
      const response = await apiClient.post('/reviews', payload);
      console.log('[ReviewService.createReview] Response:', response);
      return response;
    } catch (error) {
      console.error('[ReviewService.createReview] Error:', error.response?.data || error.message);
      // Re-throw dengan error detail dari backend
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error + (error.response.data.details ? ': ' + error.response.data.details : ''));
      }
      throw new Error(error.message || 'Gagal menambahkan review');
    }
  }
}

export default new ReviewService();
