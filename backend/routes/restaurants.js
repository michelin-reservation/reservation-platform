const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const requireRole = require('../middlewares/role');
const restaurantController = require('../controllers/restaurantController');
const { Restaurant } = require('../models');
const { cache } = require('../middlewares/cache');
const { sendSuccess, sendError, RESPONSE_CODES } = require('../utils/responseHelper');

// 공개 라우트
router.get('/search', restaurantController.searchRestaurants);
router.get('/:id', cache(300), restaurantController.getRestaurantDetails);
router.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll();
    sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.DATA_RETRIEVED,
      'Restaurants retrieved successfully',
      '레스토랑 목록을 성공적으로 조회했습니다',
      restaurants);
  } catch (error) {
    console.error('레스토랑 목록 조회 오류:', error);
    sendError(res, 500, RESPONSE_CODES.ERROR.INTERNAL_SERVER_ERROR,
      'Failed to retrieve restaurants',
      '서버 오류가 발생했습니다',
      error.message);
  }
});

// 인증이 필요한 라우트
// 레스토랑 생성 (관리자)
router.post('/', authenticateToken, requireRole(['관리자']), restaurantController.createRestaurant);
// 레스토랑 수정 (관리자)
router.put('/:id', authenticateToken, requireRole(['관리자']), restaurantController.updateRestaurant);
// 레스토랑 삭제 (관리자)
router.delete('/:id', authenticateToken, requireRole(['관리자']), restaurantController.deleteRestaurant);

module.exports = router;