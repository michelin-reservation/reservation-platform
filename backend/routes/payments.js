const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const { Payment, Reservation } = require('../models');
const { apiLimiter } = require('../middlewares/rateLimiter');

// 결제 등록
router.post('/', authenticateToken, apiLimiter, async (req, res) => {
  try {
    const { reservation_id, service_package, additional_services, reservation_fee, payment_status, payment_method } = req.body;
    // 본인 예약에 대해서만 결제 가능
    const reservation = await Reservation.findByPk(reservation_id);
    if (!reservation || reservation.user_id !== req.user.id) {
      return res.status(403).json({ message: '본인 예약에 대해서만 결제할 수 있습니다.' });
    }
    const payment = await Payment.create({ reservation_id, service_package, additional_services, reservation_fee, payment_status, payment_method });
    res.status(201).json({ success: true, payment });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 예약별 결제 내역 (본인 예약만 조회 가능)
router.get('/reservation/:reservation_id', authenticateToken, async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.reservation_id);
    if (!reservation || reservation.user_id !== req.user.id) {
      return res.status(403).json({ message: '본인 예약의 결제 내역만 조회할 수 있습니다.' });
    }
    const payments = await Payment.findAll({ where: { reservation_id: req.params.reservation_id } });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;