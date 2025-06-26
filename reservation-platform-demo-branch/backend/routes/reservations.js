const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const reservationController = require('../controllers/reservationController');
const { apiLimiter } = require('../middlewares/rateLimiter');

// 예약 생성
router.post('/', authenticateToken, apiLimiter, reservationController.createReservation);

// 내 예약 목록 조회
router.get('/user/:user_id', authenticateToken, reservationController.getUserReservations);

// 특정 예약 상세 조회
router.get('/:id', authenticateToken, reservationController.getReservationById);

// 예약 수정
router.put('/:id', authenticateToken, reservationController.updateReservation);

// 예약 취소
router.delete('/:id', authenticateToken, reservationController.cancelReservation);

module.exports = router;