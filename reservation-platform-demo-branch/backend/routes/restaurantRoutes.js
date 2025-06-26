const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const restaurantController = require('../controllers/restaurantController');

// 레스토랑 상세 조회 (Prisma 버전 사용)
router.get('/:id', restaurantController.getRestaurantDetailsPrisma);

// 레스토랑 리뷰 목록
router.get('/:id/reviews', restaurantController.getRestaurantReviews);

// 레스토랑 메뉴 목록
router.get('/:id/menu', restaurantController.getRestaurantMenu);

// 예약 가능 시간 조회
router.get('/:id/reservations/availability', restaurantController.getReservationAvailability);

// 리뷰 작성 (인증 필요)
router.post('/:id/review', authenticateToken, restaurantController.createRestaurantReview);

// Prometheus metrics endpoint
router.get('/metrics', restaurantController.getMetrics);

module.exports = router;