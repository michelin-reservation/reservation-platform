const express = require('express');
const router = express.Router();
const { Business, Restaurant, Reservation, Review } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// 사업자 설정 조회
router.get('/settings', authenticateToken, async (req, res) => {
  const business = await Business.findOne({ where: { user_id: req.user.user_id } });
  if (!business) return res.status(404).json({ message: '사업자 정보를 찾을 수 없습니다.' });
  res.json({
    businessHours: business.business_hours,
    seats: business.seats,
    notifications: business.notifications
  });
});

// 사업자 설정 수정
router.put('/settings', authenticateToken, async (req, res) => {
  const { businessHours, seats, notifications } = req.body;
  const business = await Business.findOne({ where: { user_id: req.user.user_id } });
  if (!business) return res.status(404).json({ message: '사업자 정보를 찾을 수 없습니다.' });
  business.business_hours = businessHours;
  business.seats = seats;
  business.notifications = notifications;
  await business.save();
  res.json({ success: true });
});

// 사업자 통계 조회
router.get('/statistics', authenticateToken, async (req, res) => {
  const business = await Business.findOne({ where: { user_id: req.user.user_id }, include: [{ model: Restaurant, as: 'restaurants' }] });
  if (!business) return res.status(404).json({ message: '사업자 정보를 찾을 수 없습니다.' });
  const restaurantIds = business.restaurants.map(r => r.restaurant_id);
  const totalReservations = await Reservation.count({ where: { restaurant_id: restaurantIds } });
  const totalReviews = await Review.count({ where: { restaurant_id: restaurantIds } });
  res.json({
    totalRestaurants: restaurantIds.length,
    totalReservations,
    totalReviews
  });
});

module.exports = router; 