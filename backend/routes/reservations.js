const express = require('express');
const router = express.Router();
const { Reservation } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// 예약 생성
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { restaurant_id, reservation_time, guest_count, special_request, name } = req.body;
    const user_id = req.user.user_id; // JWT에서 추출
    const reservation = await Reservation.create({ user_id, restaurant_id, reservation_time, guest_count, special_request, name });
    res.status(201).json({ success: true, reservation });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 내 예약 목록 조회
router.get('/user/:user_id', authenticateToken, async (req, res) => {
  // 본인만 자신의 예약 목록을 볼 수 있도록 체크
  if (parseInt(req.user.user_id) !== parseInt(req.params.user_id)) {
    return res.status(403).json({ message: '본인만 예약 목록을 조회할 수 있습니다.' });
  }
  const reservations = await Reservation.findAll({ where: { user_id: req.params.user_id } });
  res.json(reservations);
});

// 특정 예약 상세 조회
router.get('/:id', authenticateToken, async (req, res) => {
  const reservation = await Reservation.findByPk(req.params.id);
  if (reservation) {
    // 본인 예약만 조회 가능
    if (reservation.user_id !== req.user.user_id) {
      return res.status(403).json({ message: '본인 예약만 조회할 수 있습니다.' });
    }
    res.json(reservation);
  } else {
    res.status(404).json({ message: '예약을 찾을 수 없습니다.' });
  }
});

// 예약 수정
router.put('/:id', authenticateToken, async (req, res) => {
  const { restaurant_id, reservation_time, guest_count, special_request, name } = req.body;
  const reservation = await Reservation.findByPk(req.params.id);
  if (reservation) {
    if (reservation.user_id !== req.user.user_id) {
      return res.status(403).json({ message: '본인 예약만 수정할 수 있습니다.' });
    }
    reservation.restaurant_id = restaurant_id;
    reservation.reservation_time = reservation_time;
    reservation.guest_count = guest_count;
    reservation.special_request = special_request;
    reservation.name = name;
    await reservation.save();
    res.json(reservation);
  } else {
    res.status(404).json({ message: '예약을 찾을 수 없습니다.' });
  }
});

// 예약 취소
router.delete('/:id', authenticateToken, async (req, res) => {
  const reservation = await Reservation.findByPk(req.params.id);
  if (reservation) {
    if (reservation.user_id !== req.user.user_id) {
      return res.status(403).json({ message: '본인 예약만 취소할 수 있습니다.' });
    }
    await reservation.destroy();
    res.json({ message: '예약이 성공적으로 취소되었습니다.' });
  } else {
    res.status(404).json({ message: '예약을 찾을 수 없습니다.' });
  }
});

module.exports = router; 