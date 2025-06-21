const { Reservation, Restaurant, User } = require('../models');
const { Op } = require('sequelize');
const prometheus = require('../config/prometheus');
const { sendSuccess, sendError, commonErrors, RESPONSE_CODES } = require('../utils/responseHelper');

// 예약 생성 (reservations.js 버전)
exports.createReservation = async (req, res) => {
  try {
    const { restaurant_id, reservation_time, guest_count, name } = req.body;
    if (!restaurant_id || !reservation_time || !guest_count || !name) {
      return commonErrors.validationError(res, 'Missing required fields', 'restaurant_id, reservation_time, guest_count, name은 필수입니다');
    }
    const user_id = req.user.id; // JWT에서 추출

    // 예약 중복 확인 (같은 시간에 같은 식당에 예약이 있는지 확인)
    const existingReservation = await Reservation.findOne({
      where: {
        restaurant_id,
        reservation_time,
        status: 'confirmed'
      }
    });

    if (existingReservation) {
      return sendError(res, 400, RESPONSE_CODES.ERROR.RESERVATION_CONFLICT,
        'Reservation time conflict',
        '해당 시간에 이미 예약이 있습니다');
    }

    const reservation = await Reservation.create({
      user_id,
      restaurant_id,
      reservation_time,
      guest_count,
      name,
      status: 'confirmed'
    });

    // 예약 성공 카운터 증가
    if (prometheus && prometheus.reservationSuccessTotal) {
      prometheus.reservationSuccessTotal.inc();
    }

    sendSuccess(res, 201, RESPONSE_CODES.SUCCESS.RESERVATION_CREATED,
      'Reservation created successfully',
      '예약이 성공적으로 생성되었습니다',
      reservation);
  } catch (err) {
    console.error('예약 생성 실패:', err);
    sendError(res, 400, RESPONSE_CODES.ERROR.VALIDATION_FAILED,
      'Failed to create reservation',
      '예약 생성에 실패했습니다',
      err.message);
  }
};

// 내 예약 목록 조회 (reservations.js 버전)
exports.getUserReservations = async (req, res) => {
  try {
    // 본인만 자신의 예약 목록을 볼 수 있도록 체크
    if (parseInt(req.user.id) !== parseInt(req.params.user_id)) {
      return commonErrors.forbidden(res, 'Can only view own reservations', '본인만 예약 목록을 조회할 수 있습니다');
    }

    const reservations = await Reservation.findAll({
      where: { user_id: req.params.user_id },
      include: [
        {
          model: Restaurant,
          attributes: ['id', 'name_korean', 'address', 'phone', 'type', 'rating']
        }
      ],
      order: [['reservation_time', 'DESC']]
    });

    sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.RESERVATION_LIST_GET,
      'User reservations retrieved successfully',
      '예약 목록을 성공적으로 조회했습니다',
      reservations);
  } catch (error) {
    console.error('예약 목록 조회 실패:', error);
    sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
      'Failed to retrieve user reservations',
      '예약 목록 조회 중 오류가 발생했습니다',
      error.message);
  }
};

// 특정 예약 상세 조회 (reservations.js 버전)
exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Restaurant,
          attributes: ['id', 'name_korean', 'address', 'phone', 'type', 'rating']
        }
      ]
    });

    if (reservation) {
      // 본인 예약만 조회 가능
      if (reservation.user_id !== req.user.id) {
        return commonErrors.forbidden(res, 'Can only view own reservation', '본인 예약만 조회할 수 있습니다');
      }
      sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.RESERVATION_DETAIL_GET,
        'Reservation details retrieved successfully',
        '예약 상세 정보를 성공적으로 조회했습니다',
        reservation);
    } else {
      commonErrors.notFound(res, 'Reservation not found', '예약을 찾을 수 없습니다');
    }
  } catch (error) {
    console.error('예약 상세 조회 실패:', error);
    sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
      'Failed to retrieve reservation details',
      '예약 상세 조회 중 오류가 발생했습니다',
      error.message);
  }
};

// 예약 수정 (reservations.js 버전)
exports.updateReservation = async (req, res) => {
  try {
    const { restaurant_id, reservation_time, guest_count, special_request, name } = req.body;
    const reservation = await Reservation.findByPk(req.params.id);

    if (reservation) {
      if (reservation.user_id !== req.user.id) {
        return commonErrors.forbidden(res, 'Can only update own reservation', '본인 예약만 수정할 수 있습니다');
      }

      // 예약 시간 변경 시 중복 확인
      if (reservation_time && reservation_time !== reservation.reservation_time) {
        const existingReservation = await Reservation.findOne({
          where: {
            restaurant_id: restaurant_id || reservation.restaurant_id,
            reservation_time,
            status: 'confirmed',
            id: { [Op.ne]: req.params.id }
          }
        });

        if (existingReservation) {
          return sendError(res, 400, RESPONSE_CODES.ERROR.RESERVATION_CONFLICT,
            'Reservation time conflict',
            '해당 시간에 이미 예약이 있습니다');
        }
      }

      reservation.restaurant_id = restaurant_id || reservation.restaurant_id;
      reservation.reservation_time = reservation_time || reservation.reservation_time;
      reservation.guest_count = guest_count || reservation.guest_count;
      reservation.special_request = special_request || reservation.special_request;
      reservation.name = name || reservation.name;

      await reservation.save();
      sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.RESERVATION_UPDATED,
        'Reservation updated successfully',
        '예약이 성공적으로 수정되었습니다',
        reservation);
    } else {
      commonErrors.notFound(res, 'Reservation not found', '예약을 찾을 수 없습니다');
    }
  } catch (error) {
    console.error('예약 수정 실패:', error);
    sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
      'Failed to update reservation',
      '예약 수정 중 오류가 발생했습니다',
      error.message);
  }
};

// 예약 취소 (reservations.js 버전)
exports.cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);

    if (reservation) {
      if (reservation.user_id !== req.user.id) {
        return commonErrors.forbidden(res, 'Can only cancel own reservation', '본인 예약만 취소할 수 있습니다');
      }

      // 예약 상태를 'cancelled'로 변경 (완전 삭제 대신)
      await reservation.update({ status: 'cancelled' });
      sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.RESERVATION_CANCELLED,
        'Reservation cancelled successfully',
        '예약이 성공적으로 취소되었습니다');
    } else {
      commonErrors.notFound(res, 'Reservation not found', '예약을 찾을 수 없습니다');
    }
  } catch (error) {
    console.error('예약 취소 실패:', error);
    sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
      'Failed to cancel reservation',
      '예약 취소 중 오류가 발생했습니다',
      error.message);
  }
};

// 예약 완전 삭제 (관리자용)
exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);

    if (reservation) {
      if (reservation.user_id !== req.user.id) {
        return commonErrors.forbidden(res, 'Can only delete own reservation', '본인 예약만 삭제할 수 있습니다');
      }

      await reservation.destroy();
      sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.OPERATION_COMPLETED,
        'Reservation deleted successfully',
        '예약이 완전히 삭제되었습니다');
    } else {
      commonErrors.notFound(res, 'Reservation not found', '예약을 찾을 수 없습니다');
    }
  } catch (error) {
    console.error('예약 삭제 실패:', error);
    sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
      'Failed to delete reservation',
      '예약 삭제 중 오류가 발생했습니다',
      error.message);
  }
};

// 기존 함수들 (호환성을 위해 유지)
// 예약 생성 (기존 버전)
exports.createReservationLegacy = async (req, res) => {
  try {
    const { restaurantId, date, time, numberOfPeople, specialRequests } = req.body;
    const userId = req.user.id;

    // 예약 가능 여부 확인
    const existingReservation = await Reservation.findOne({
      where: {
        restaurantId,
        date,
        time,
        status: 'confirmed'
      }
    });

    if (existingReservation) {
      return sendError(res, 400, RESPONSE_CODES.ERROR.RESERVATION_CONFLICT,
        'Reservation time conflict',
        '해당 시간에 이미 예약이 있습니다');
    }

    const reservation = await Reservation.create({
      userId,
      restaurantId,
      date,
      time,
      numberOfPeople,
      specialRequests,
      status: 'confirmed'
    });

    // 예약 성공 카운터 증가
    if (prometheus && prometheus.reservationSuccessTotal) {
      prometheus.reservationSuccessTotal.inc();
    }

    sendSuccess(res, 201, RESPONSE_CODES.SUCCESS.RESERVATION_CREATED,
      'Reservation created successfully',
      '예약이 성공적으로 생성되었습니다',
      reservation);
  } catch (error) {
    console.error('예약 생성 실패:', error);
    sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
      'Failed to create reservation',
      '예약 생성 중 오류가 발생했습니다',
      error.message);
  }
};

// 사용자의 예약 목록 조회 (기존 버전)
exports.getMyReservations = async (req, res) => {
  try {
    const userId = req.user.id;
    const reservations = await Reservation.findAll({
      where: { userId },
      include: [
        {
          model: Restaurant,
          attributes: ['name', 'address', 'phone']
        }
      ],
      order: [['date', 'DESC'], ['time', 'DESC']]
    });

    sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.RESERVATION_LIST_GET,
      'My reservations retrieved successfully',
      '내 예약 목록을 성공적으로 조회했습니다',
      reservations);
  } catch (error) {
    console.error('예약 목록 조회 실패:', error);
    sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
      'Failed to retrieve my reservations',
      '예약 목록 조회 중 오류가 발생했습니다',
      error.message);
  }
};

// 특정 유저의 예약 목록 조회 (RESTful - 기존 버전)
exports.getUserReservationsLegacy = async (req, res) => {
  try {
    const { user_id } = req.params;
    const reservations = await Reservation.findAll({
      where: { userId: user_id },
      include: [
        {
          model: Restaurant,
          attributes: ['name', 'address', 'phone']
        }
      ],
      order: [['date', 'DESC'], ['time', 'DESC']]
    });
    sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.RESERVATION_LIST_GET,
      'User reservations retrieved successfully',
      '사용자 예약 목록을 성공적으로 조회했습니다',
      reservations);
  } catch (error) {
    console.error('특정 유저 예약 목록 조회 실패:', error);
    sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
      'Failed to retrieve user reservations',
      '특정 유저 예약 목록 조회 중 오류가 발생했습니다',
      error.message);
  }
};