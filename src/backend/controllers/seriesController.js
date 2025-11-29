import { SeriesModel } from '../models/seriesModel.js';
import { ReviewModel } from '../models/reviewModel.js';

export const SeriesController = {
  async all(req, res) {
    try {
      const series = await SeriesModel.getAll();
      res.json(series);
    } catch (error) {
      console.error('[Series.all] Error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      console.log('[Series.create] Full req.body:', JSON.stringify(req.body, null, 2));
      
      const body = req.body || {};
      let { title, genre, status, rating, tahun, image_url, description } = body;
      
      console.log('[Series.create] Extracted - title:', title, 'genre:', genre, 'rating:', rating);
      
      if (!title || title.trim() === '') {
        return res.status(400).json({ 
          error: 'Title is required',
          receivedBody: req.body,
          bodyKeys: Object.keys(req.body || {})
        });
      }

      // Validate status - harus salah satu dari nilai yang valid
      const validStatus = ['ongoing', 'completed', 'upcoming'];
      if (status && !validStatus.includes(status.toLowerCase())) {
        status = 'ongoing'; // default jika tidak valid
      }

      const seriesData = {
        title,
        genre: genre || null,
        status: status || 'ongoing',
        rating: rating !== undefined ? Number(rating) : 0,
        tahun: tahun || new Date().getFullYear(),
        image_url: image_url || null,
        description: description || null,
      };

      console.log('[Series.create] Inserting:', JSON.stringify(seriesData, null, 2));

      const newSeries = await SeriesModel.create(seriesData);
      
      console.log('[Series.create] Success! Created series:', newSeries);

      res.status(201).json({ 
        message: 'Series created successfully', 
        data: newSeries,
        success: true
      });
    } catch (error) {
      console.error('[Series.create] Error:', error);
      res.status(500).json({ 
        error: error.message,
        details: error.details || error.toString()
      });
    }
  },

  async detail(req, res) {
    try {
      const series = await SeriesModel.getById(req.params.id);
      if (!series) return res.status(404).json({ error: 'Series not found' });

      const reviews = await ReviewModel.getSeriesReviews(req.params.id);
      res.json({ series, reviews });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      let { title, genre, status, rating, tahun, image_url } = req.body;
      
      // Validate status
      const validStatus = ['ongoing', 'completed', 'upcoming'];
      if (status && !validStatus.includes(status.toLowerCase())) {
        status = undefined; // jangan update jika tidak valid
      }
      
      const updatedSeries = await SeriesModel.update(req.params.id, {
        title: title || undefined,
        genre: genre || undefined,
        status: status || undefined,
        rating: rating || undefined,
        tahun: tahun || undefined,
        image_url: image_url || undefined
      });

      res.json({ message: 'Series updated successfully', data: updatedSeries });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      await SeriesModel.delete(req.params.id);
      res.json({ message: 'Series deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async search(req, res) {
    try {
      const results = await SeriesModel.search(req.query.q || "");
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
