import { FavoriteModel } from "../models/favoritesModel.js";

const FavoriteController = {
    async add(req, res) {
        try {
            let { identifier, series_id } = req.body;
            
            if (!series_id) {
                return res.status(400).json({ error: 'series_id is required' });
            }

            // Jika identifier tidak diberikan, gunakan default
            if (!identifier) {
                identifier = `Anonymous-${Date.now()}`;
            }

            const fav = await FavoriteModel.addFavorite(identifier, series_id);
            res.status(201).json({ message: 'Added to favorites', data: fav });
        } catch (error) {
            console.error('Error adding favorite:', error);
            res.status(500).json({ error: error.message });
        }
    },

    async remove(req, res) {
        try {
            let { identifier, series_id } = req.body;
            
            if (!series_id) {
                return res.status(400).json({ error: 'series_id is required' });
            }

            if (!identifier) {
                identifier = `Anonymous-${Date.now()}`;
            }

            await FavoriteModel.removeFavorite(identifier, series_id);
            res.json({ message: 'Removed from favorites' });
        } catch (error) {
            console.error('Error removing favorite:', error);
            res.status(500).json({ error: error.message });
        }
    },

    async userFavs(req, res) {
        try {
            const { identifier } = req.params;
            
            if (!identifier) {
                return res.status(400).json({ error: 'identifier is required' });
            }

            const favs = await FavoriteModel.getUserFavorites(identifier);
            res.json(favs);
        } catch (error) {
            console.error('Error getting favorites:', error);
            res.status(500).json({ error: error.message });
        }
    }
};

export default FavoriteController;
