import express from 'express';
import * as restaurantController from '../controllers/restaurantController';
const router = express.Router();

router.get('/', restaurantController.getAllRestaurants);
router.get('/:id', restaurantController.getRestaurantById);

export default router; 