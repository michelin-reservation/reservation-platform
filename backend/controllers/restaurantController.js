const { Restaurant, Review, Reservation } = require('../models');
const { Op } = require('sequelize');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 모든 레스토랑 조회
const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll({
      attributes: { exclude: ['reviews', 'reservations'] }
    });
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: '레스토랑 목록을 불러오는데 실패했습니다.', error: error.message });
  }
};

// 레스토랑 검색
const searchRestaurants = async (req, res) => {
  try {
    const { keyword, cuisine, priceRange, location, page = 1, limit = 10 } = req.query;
    const where = {};

    if (keyword) {
      where[Op.or] = [
        { name: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } }
      ];
    }
    if (cuisine) where.cuisine = cuisine;
    if (priceRange) where.priceRange = priceRange;
    if (location) {
      // MySQL의 ST_Distance_Sphere 함수를 사용하여 거리 계산
      where.location = {
        [Op.and]: [
          Sequelize.literal(`ST_Distance_Sphere(
            location,
            POINT(${location.split(',').join(',')})
          ) <= 10000`)
        ]
      };
    }

    const offset = (page - 1) * limit;
    const { count, rows: restaurants } = await Restaurant.findAndCountAll({
      where,
      attributes: { exclude: ['reviews', 'reservations'] },
      offset,
      limit: parseInt(limit)
    });

    res.json({
      restaurants,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: '레스토랑 검색에 실패했습니다.', error: error.message });
  }
};

// 레스토랑 생성
const createRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(400).json({ message: '레스토랑 생성에 실패했습니다.', error: error.message });
  }
};

// 레스토랑 수정
const updateRestaurant = async (req, res) => {
  try {
    const [updated] = await Restaurant.update(req.body, {
      where: { id: req.params.id },
      returning: true
    });

    if (!updated) {
      return res.status(404).json({ message: '레스토랑을 찾을 수 없습니다.' });
    }

    const restaurant = await Restaurant.findByPk(req.params.id);
    res.json(restaurant);
  } catch (error) {
    res.status(400).json({ message: '레스토랑 수정에 실패했습니다.', error: error.message });
  }
};

// 레스토랑 삭제
const deleteRestaurant = async (req, res) => {
  try {
    const deleted = await Restaurant.destroy({
      where: { id: req.params.id }
    });

    if (!deleted) {
      return res.status(404).json({ message: '레스토랑을 찾을 수 없습니다.' });
    }

    res.json({ message: '레스토랑이 성공적으로 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '레스토랑 삭제에 실패했습니다.', error: error.message });
  }
};

// 레스토랑 상세 정보 조회 (Sequelize 버전)
const getRestaurantDetails = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id, {
      include: [
        { model: Review },
        { model: Reservation }
      ]
    });

    if (!restaurant) {
      return res.status(404).json({ message: '레스토랑을 찾을 수 없습니다.' });
    }

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: '레스토랑 정보를 불러오는데 실패했습니다.', error: error.message });
  }
};

// 레스토랑 상세 정보 조회 (Prisma 버전)
const getRestaurantDetailsPrisma = async (req, res) => {
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
};

// 레스토랑 리뷰 목록 조회
const getRestaurantReviews = async (req, res) => {
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
};

// 레스토랑 메뉴 목록 조회
const getRestaurantMenu = async (req, res) => {
  try {
    const menus = await prisma.menu.findMany({
      where: { restaurantId: req.params.id }
    });
    res.json(menus);
  } catch (error) {
    res.status(500).json({ message: '서버 에러가 발생했습니다.' });
  }
};

// 예약 가능 시간 계산 함수
const calculateAvailableTimes = (reservations) => {
  // 기본 영업 시간 (예: 11:00-22:00)
  const businessHours = {
    start: 11,
    end: 22
  };

  // 예약된 시간들을 추출
  const bookedTimes = reservations.map(r => {
    const time = new Date(r.date);
    return time.getHours();
  });

  // 가능한 시간들 계산
  const availableTimes = [];
  for (let hour = businessHours.start; hour < businessHours.end; hour++) {
    if (!bookedTimes.includes(hour)) {
      availableTimes.push(`${hour}:00`);
    }
  }

  return availableTimes;
};

// 예약 가능 시간 조회
const getReservationAvailability = async (req, res) => {
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
};

// 레스토랑 리뷰 작성
const createRestaurantReview = async (req, res) => {
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
};

// Prometheus 메트릭 조회
const getMetrics = async (req, res) => {
  try {
    const prometheus = require('../config/prometheus');
    res.set('Content-Type', prometheus.register.contentType);
    res.end(await prometheus.register.metrics());
  } catch (error) {
    res.status(500).json({ message: '메트릭 조회에 실패했습니다.' });
  }
};

module.exports = {
  getAllRestaurants,
  searchRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantDetails,
  getRestaurantDetailsPrisma,
  getRestaurantReviews,
  getRestaurantMenu,
  getReservationAvailability,
  createRestaurantReview,
  getMetrics
};