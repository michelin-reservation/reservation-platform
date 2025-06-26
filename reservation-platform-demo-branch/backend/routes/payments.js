const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const { Payment, Reservation } = require('../models');
const { apiLimiter } = require('../middlewares/rateLimiter');
const { sendSuccess, sendError, RESPONSE_CODES } = require('../utils/responseHelper');

// 결제 등록
router.post('/', authenticateToken, apiLimiter, async (req, res) => {
  try {
    const { reservation_id, service_package, additional_services, reservation_fee, payment_status, payment_method } = req.body;
    // 본인 예약에 대해서만 결제 가능
    const reservation = await Reservation.findByPk(reservation_id);
    if (!reservation || reservation.user_id !== req.user.id) {
      return sendError(res, 403, RESPONSE_CODES.ERROR.FORBIDDEN,
        'Payment can only be made for own reservation',
        '본인 예약에 대해서만 결제할 수 있습니다');
    }
    const payment = await Payment.create({ reservation_id, service_package, additional_services, reservation_fee, payment_status, payment_method });
    sendSuccess(res, 201, RESPONSE_CODES.SUCCESS.PAYMENT_CREATED,
      'Payment created successfully',
      '결제가 성공적으로 등록되었습니다',
      payment);
  } catch (err) {
    sendError(res, 400, RESPONSE_CODES.ERROR.INVALID_REQUEST,
      'Failed to create payment',
      '결제 등록에 실패했습니다',
      err.message);
  }
});

// 예약별 결제 내역 (본인 예약만 조회 가능)
router.get('/reservation/:reservation_id', authenticateToken, async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.reservation_id);
    if (!reservation || reservation.user_id !== req.user.id) {
      return sendError(res, 403, RESPONSE_CODES.ERROR.FORBIDDEN,
        'Can only view payment history for own reservation',
        '본인 예약의 결제 내역만 조회할 수 있습니다');
    }
    const payments = await Payment.findAll({ where: { reservation_id: req.params.reservation_id } });
    sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.DATA_RETRIEVED,
      'Payment history retrieved successfully',
      '결제 내역을 성공적으로 조회했습니다',
      payments);
  } catch (err) {
    sendError(res, 500, RESPONSE_CODES.ERROR.INTERNAL_SERVER_ERROR,
      'Failed to retrieve payment history',
      '서버 오류가 발생했습니다',
      err.message);
  }
});

module.exports = router;