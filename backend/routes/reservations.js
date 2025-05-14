const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { authenticateToken } = require('../middleware/auth');

// 예약 생성
router.post('/', authenticateToken, reservationController.createReservation);

// 사용자의 예약 목록 조회
router.get('/my-reservations', authenticateToken, reservationController.getMyReservations);

// 특정 예약 상세 조회
router.get('/:id', authenticateToken, reservationController.getReservationById);

// 예약 수정
router.put('/:id', authenticateToken, reservationController.updateReservation);

// 예약 취소
router.delete('/:id', authenticateToken, reservationController.cancelReservation);

module.exports = router; 