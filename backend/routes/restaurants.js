const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

// 레스토랑 검색
router.get('/search', restaurantController.searchRestaurants);

// 기본 CRUD 라우트
router.get('/', restaurantController.getAllRestaurants);
router.get('/:id', restaurantController.getRestaurant);
router.post('/', restaurantController.createRestaurant);
router.put('/:id', restaurantController.updateRestaurant);
router.delete('/:id', restaurantController.deleteRestaurant);

module.exports = router; 