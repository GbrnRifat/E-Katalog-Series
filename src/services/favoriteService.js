import apiClient from './api';

class FavoriteService {
  /**
   * Get user favorites
   */
  async getFavorites(identifier) {
    try {
      const response = await apiClient.get(`/favorites/${identifier}`);
      return response;
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw error;
    }
  }

  /**
   * Add to favorites
   */
  async addFavorite(identifier, seriesId) {
    try {
      const response = await apiClient.post('/favorites', {
        identifier,
        series_id: seriesId
      });
      return response;
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  }

  /**
   * Remove from favorites
   */
  async removeFavorite(identifier, seriesId) {
    try {
      const response = await apiClient.post('/favorites/remove', {
        identifier,
        series_id: seriesId
      });
      return response;
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  }
}

export default new FavoriteService();
