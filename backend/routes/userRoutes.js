const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const userController = require('../controllers/userController');
const reservationController = require('../controllers/reservationController');
const reviewController = require('../controllers/reviewController');

router.get('/me', authenticateToken, userController.getProfile);
router.put('/profile', authenticateToken, userController.updateProfile);

// 알림 설정 조회
router.get('/notifications', authenticateToken, userController.getNotificationSettings);

// 알림 설정 업데이트
router.put('/notifications', authenticateToken, userController.updateNotificationSettings);

router.get('/:user_id/reservations', authenticateToken, reservationController.getUserReservations);
router.get('/:user_id/reviews', authenticateToken, reviewController.getUserReviews);

module.exports = router; 