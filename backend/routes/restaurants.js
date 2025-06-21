const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const { requireRole } = require('../middlewares/role');
const restaurantController = require('../controllers/restaurantController');
const { Restaurant } = require('../models');
const { cache } = require('../middlewares/cache');

// 공개 라우트
router.get('/search', restaurantController.searchRestaurants);
router.get('/:id', cache(300), restaurantController.getRestaurantDetails);
router.get('/', async (req, res) => {
  const restaurants = await Restaurant.findAll();
  res.json(restaurants);
});

// 인증이 필요한 라우트
// 레스토랑 생성 (관리자)
router.post('/', authenticateToken, requireRole(['관리자']), restaurantController.createRestaurant);
// 레스토랑 수정 (관리자)
router.put('/:id', authenticateToken, requireRole(['관리자']), restaurantController.updateRestaurant);
// 레스토랑 삭제 (관리자)
router.delete('/:id', authenticateToken, requireRole(['관리자']), restaurantController.deleteRestaurant);

module.exports = router;