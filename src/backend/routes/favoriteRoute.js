import express from 'express';
import FavoriteController from '../controllers/favoritesController.js';

const router = express.Router();

// POST endpoints
router.post('/', FavoriteController.add);
router.post('/add', FavoriteController.add);
router.post('/remove', FavoriteController.remove);

// GET endpoints
router.get('/:identifier', FavoriteController.userFavs);

export default router;
