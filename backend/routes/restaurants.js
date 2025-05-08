const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const restaurantController = require('../controllers/restaurantController');

// 공개 라우트
router.get('/search', restaurantController.searchRestaurants);
router.get('/:id', restaurantController.getRestaurantDetails);
router.get('/', restaurantController.getAllRestaurants);

// 인증이 필요한 라우트
router.post('/', auth, restaurantController.createRestaurant);
router.put('/:id', auth, restaurantController.updateRestaurant);
router.delete('/:id', auth, restaurantController.deleteRestaurant);

module.exports = router; 