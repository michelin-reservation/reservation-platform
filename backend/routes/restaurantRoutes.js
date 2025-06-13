const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 레스토랑 상세 조회
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: req.params.id },
      include: {
        menus: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });
    
    if (!restaurant) {
      return res.status(404).json({ message: '레스토랑을 찾을 수 없습니다.' });
    }
    
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: '서버 에러가 발생했습니다.' });
  }
});

// 레스토랑 리뷰 목록
router.get('/:id/reviews', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { restaurantId: req.params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: '서버 에러가 발생했습니다.' });
  }
});

// 레스토랑 메뉴 목록
router.get('/:id/menu', async (req, res) => {
  try {
    const menus = await prisma.menu.findMany({
      where: { restaurantId: req.params.id }
    });
    res.json(menus);
  } catch (error) {
    res.status(500).json({ message: '서버 에러가 발생했습니다.' });
  }
});

// 예약 가능 시간 조회
router.get('/:id/reservations/availability', async (req, res) => {
  try {
    const { date } = req.query;
    const reservations = await prisma.reservation.findMany({
      where: {
        restaurantId: req.params.id,
        date: new Date(date),
        status: 'CONFIRMED'
      }
    });
    
    // 예약 가능 시간 계산 로직
    const availableTimes = calculateAvailableTimes(reservations);
    res.json(availableTimes);
  } catch (error) {
    res.status(500).json({ message: '서버 에러가 발생했습니다.' });
  }
});

// 리뷰 작성
router.post('/:id/review', async (req, res) => {
  try {
    const { userId, rating, content } = req.body;
    const review = await prisma.review.create({
      data: {
        restaurantId: req.params.id,
        userId,
        rating,
        content
      }
    });
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: '서버 에러가 발생했습니다.' });
  }
});

module.exports = router; 