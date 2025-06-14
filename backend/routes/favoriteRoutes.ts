import express from 'express';
import * as favoriteController from '../controllers/favoriteController';
const router = express.Router();

router.post('/', favoriteController.addFavorite);
router.get('/user/:userId', favoriteController.getFavoritesByUser);
router.delete('/:id', favoriteController.deleteFavorite);

export default router; 