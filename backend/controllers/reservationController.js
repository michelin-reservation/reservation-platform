const { Reservation, Restaurant, User } = require('../models');
const { Op } = require('sequelize');

// 예약 생성
exports.createReservation = async (req, res) => {
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

// 사용자의 예약 목록 조회
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

// 특정 예약 상세 조회
exports.getReservationById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const reservation = await Reservation.findOne({
      where: { id, userId },
      include: [
        {
          model: Restaurant,
          attributes: ['name', 'address', 'phone']
        }
      ]
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: '예약을 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      data: reservation
    });
  } catch (error) {
    console.error('예약 상세 조회 실패:', error);
    res.status(500).json({
      success: false,
      message: '예약 상세 조회 중 오류가 발생했습니다.'
    });
  }
};

// 예약 수정
exports.updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { date, time, numberOfPeople, specialRequests } = req.body;

    const reservation = await Reservation.findOne({
      where: { id, userId }
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: '예약을 찾을 수 없습니다.'
      });
    }

    // 예약 가능 여부 확인
    if (date && time) {
      const existingReservation = await Reservation.findOne({
        where: {
          restaurantId: reservation.restaurantId,
          date,
          time,
          status: 'confirmed',
          id: { [Op.ne]: id }
        }
      });

      if (existingReservation) {
        return res.status(400).json({
          success: false,
          message: '해당 시간에 이미 예약이 있습니다.'
        });
      }
    }

    await reservation.update({
      date: date || reservation.date,
      time: time || reservation.time,
      numberOfPeople: numberOfPeople || reservation.numberOfPeople,
      specialRequests: specialRequests || reservation.specialRequests
    });

    res.json({
      success: true,
      data: reservation
    });
  } catch (error) {
    console.error('예약 수정 실패:', error);
    res.status(500).json({
      success: false,
      message: '예약 수정 중 오류가 발생했습니다.'
    });
  }
};

// 예약 취소
exports.cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const reservation = await Reservation.findOne({
      where: { id, userId }
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: '예약을 찾을 수 없습니다.'
      });
    }

    await reservation.update({ status: 'cancelled' });

    res.json({
      success: true,
      message: '예약이 취소되었습니다.'
    });
  } catch (error) {
    console.error('예약 취소 실패:', error);
    res.status(500).json({
      success: false,
      message: '예약 취소 중 오류가 발생했습니다.'
    });
  }
}; 