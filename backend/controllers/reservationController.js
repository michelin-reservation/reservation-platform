const { Reservation, Restaurant, User } = require('../models');
const { Op } = require('sequelize');
const prometheus = require('../config/prometheus');

// 예약 생성 (reservations.js 버전)
exports.createReservation = async (req, res) => {
  try {
    const { restaurant_id, reservation_time, guest_count, special_request, name } = req.body;
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
      return res.status(400).json({
        success: false,
        message: '해당 시간에 이미 예약이 있습니다.'
      });
    }

    const reservation = await Reservation.create({
      user_id,
      restaurant_id,
      reservation_time,
      guest_count,
      special_request,
      name,
      status: 'confirmed'
    });

    // 예약 성공 카운터 증가
    if (prometheus && prometheus.reservationSuccessTotal) {
      prometheus.reservationSuccessTotal.inc();
    }

    res.status(201).json({ success: true, reservation });
  } catch (err) {
    console.error('예약 생성 실패:', err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// 내 예약 목록 조회 (reservations.js 버전)
exports.getUserReservations = async (req, res) => {
  try {
    // 본인만 자신의 예약 목록을 볼 수 있도록 체크
    if (parseInt(req.user.id) !== parseInt(req.params.user_id)) {
      return res.status(403).json({ message: '본인만 예약 목록을 조회할 수 있습니다.' });
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

    res.json({ success: true, data: reservations });
  } catch (error) {
    console.error('예약 목록 조회 실패:', error);
    res.status(500).json({
      success: false,
      message: '예약 목록 조회 중 오류가 발생했습니다.'
    });
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
        return res.status(403).json({ message: '본인 예약만 조회할 수 있습니다.' });
      }
      res.json({ success: true, data: reservation });
    } else {
      res.status(404).json({ success: false, message: '예약을 찾을 수 없습니다.' });
    }
  } catch (error) {
    console.error('예약 상세 조회 실패:', error);
    res.status(500).json({
      success: false,
      message: '예약 상세 조회 중 오류가 발생했습니다.'
    });
  }
};

// 예약 수정 (reservations.js 버전)
exports.updateReservation = async (req, res) => {
  try {
    const { restaurant_id, reservation_time, guest_count, special_request, name } = req.body;
    const reservation = await Reservation.findByPk(req.params.id);

    if (reservation) {
      if (reservation.user_id !== req.user.id) {
        return res.status(403).json({ message: '본인 예약만 수정할 수 있습니다.' });
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
          return res.status(400).json({
            success: false,
            message: '해당 시간에 이미 예약이 있습니다.'
          });
        }
      }

      reservation.restaurant_id = restaurant_id || reservation.restaurant_id;
      reservation.reservation_time = reservation_time || reservation.reservation_time;
      reservation.guest_count = guest_count || reservation.guest_count;
      reservation.special_request = special_request || reservation.special_request;
      reservation.name = name || reservation.name;

      await reservation.save();
      res.json({ success: true, data: reservation });
    } else {
      res.status(404).json({ success: false, message: '예약을 찾을 수 없습니다.' });
    }
  } catch (error) {
    console.error('예약 수정 실패:', error);
    res.status(500).json({
      success: false,
      message: '예약 수정 중 오류가 발생했습니다.'
    });
  }
};

// 예약 취소 (reservations.js 버전)
exports.cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);

    if (reservation) {
      if (reservation.user_id !== req.user.id) {
        return res.status(403).json({ message: '본인 예약만 취소할 수 있습니다.' });
      }

      // 예약 상태를 'cancelled'로 변경 (완전 삭제 대신)
      await reservation.update({ status: 'cancelled' });
      res.json({ success: true, message: '예약이 성공적으로 취소되었습니다.' });
    } else {
      res.status(404).json({ success: false, message: '예약을 찾을 수 없습니다.' });
    }
  } catch (error) {
    console.error('예약 취소 실패:', error);
    res.status(500).json({
      success: false,
      message: '예약 취소 중 오류가 발생했습니다.'
    });
  }
};

// 예약 완전 삭제 (관리자용)
exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);

    if (reservation) {
      if (reservation.user_id !== req.user.id) {
        return res.status(403).json({ message: '본인 예약만 삭제할 수 있습니다.' });
      }

      await reservation.destroy();
      res.json({ success: true, message: '예약이 완전히 삭제되었습니다.' });
    } else {
      res.status(404).json({ success: false, message: '예약을 찾을 수 없습니다.' });
    }
  } catch (error) {
    console.error('예약 삭제 실패:', error);
    res.status(500).json({
      success: false,
      message: '예약 삭제 중 오류가 발생했습니다.'
    });
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
      return res.status(400).json({
        success: false,
        message: '해당 시간에 이미 예약이 있습니다.'
      });
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

    res.status(201).json({
      success: true,
      data: reservation
    });
  } catch (error) {
    console.error('예약 생성 실패:', error);
    res.status(500).json({
      success: false,
      message: '예약 생성 중 오류가 발생했습니다.'
    });
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

    res.json({
      success: true,
      data: reservations
    });
  } catch (error) {
    console.error('예약 목록 조회 실패:', error);
    res.status(500).json({
      success: false,
      message: '예약 목록 조회 중 오류가 발생했습니다.'
    });
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
    res.json({ success: true, data: reservations });
  } catch (error) {
    console.error('특정 유저 예약 목록 조회 실패:', error);
    res.status(500).json({ success: false, message: '특정 유저 예약 목록 조회 중 오류가 발생했습니다.' });
  }
};