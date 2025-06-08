const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const restaurantController = require('../controllers/restaurantController');
const { Restaurant } = require('../models');

// 공개 라우트
router.get('/search', restaurantController.searchRestaurants);
router.get('/:id', async (req, res) => {
  const restaurant = await Restaurant.findByPk(req.params.id);
  if (!restaurant) return res.status(404).json({ message: '식당을 찾을 수 없습니다.' });
  res.json(restaurant);
});
router.get('/', async (req, res) => {
  const restaurants = await Restaurant.findAll();
  res.json(restaurants);
});

// 인증이 필요한 라우트
router.post('/', authenticateToken, restaurantController.createRestaurant);
router.put('/:id', authenticateToken, restaurantController.updateRestaurant);
router.delete('/:id', authenticateToken, restaurantController.deleteRestaurant);

module.exports = router; 