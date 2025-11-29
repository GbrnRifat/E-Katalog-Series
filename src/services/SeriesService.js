import apiClient from './api';
import { DataSeries } from '../data/series';

class SeriesService {
  /**
   * Get all series
   */
  async getSeries(params = {}) {
    try {
      const response = await apiClient.get('/series', { params });
      return response;
    } catch (error) {
      console.error('Error fetching series:', error);
      
      return Object.values(DataSeries);
    }
  }

  /**
   * Get series by ID with reviews
   */
  async getSeriesById(id) {
    try {
      const response = await apiClient.get(`/series/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching series:', error);
      throw error;
    }
  }

  /**
   * Create new series
   */
  async createSeries(seriesData) {
    try {
      console.log('[SeriesService.createSeries] Sending data:', seriesData);
      const response = await apiClient.post('/series', seriesData);
      console.log('[SeriesService.createSeries] Response:', response);
      return response;
    } catch (error) {
      console.error('[SeriesService.createSeries] Error:', error);
      // Re-throw with better error message
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  }

  /**
   * Update series
   */
  async updateSeries(id, seriesData) {
    try {
      const response = await apiClient.put(`/series/${id}`, seriesData);
      return response;
    } catch (error) {
      console.error('Error updating series:', error);
      throw error;
    }
  }

  /**
   * Delete series
   */
  async deleteSeries(id) {
    try {
      const response = await apiClient.delete(`/series/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting series:', error);
      throw error;
    }
  }

  /**
   * Search series
   */
  async searchSeries(query) {
    try {
      const response = await apiClient.get('/series/search', {
        params: { q: query }
      });
      return response;
    } catch (error) {
      console.error('Error searching series:', error);
      throw error;
    }
  }
}

export default new SeriesService();
