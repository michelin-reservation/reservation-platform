const { Restaurant, Review, Reservation } = require('../models');
const { Op } = require('sequelize');
const { PrismaClient } = require('@prisma/client');
const { sendSuccess, sendError, commonErrors, RESPONSE_CODES } = require('../utils/responseHelper');
const prisma = new PrismaClient();

// 모든 레스토랑 조회
const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll({
      attributes: { exclude: ['reviews', 'reservations'] }
    });
    sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.RESTAURANT_LIST_GET,
      'Restaurant list retrieved successfully',
      '레스토랑 목록을 성공적으로 조회했습니다',
      restaurants);
  } catch (error) {
    sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
      'Failed to retrieve restaurant list',
      '레스토랑 목록을 불러오는데 실패했습니다',
      error.message);
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

    sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.RESTAURANT_LIST_GET,
      'Restaurant search completed successfully',
      '레스토랑 검색이 완료되었습니다',
      {
        restaurants,
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        total: count
      });
  } catch (error) {
    sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
      'Failed to search restaurants',
      '레스토랑 검색에 실패했습니다',
      error.message);
  }
};

// 레스토랑 생성
const createRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.create(req.body);
    sendSuccess(res, 201, RESPONSE_CODES.SUCCESS.RESTAURANT_CREATED,
      'Restaurant created successfully',
      '레스토랑이 성공적으로 생성되었습니다',
      restaurant);
  } catch (error) {
    sendError(res, 400, RESPONSE_CODES.ERROR.VALIDATION_FAILED,
      'Failed to create restaurant',
      '레스토랑 생성에 실패했습니다',
      error.message);
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
      return commonErrors.notFound(res, 'Restaurant not found', '레스토랑을 찾을 수 없습니다');
    }

    const restaurant = await Restaurant.findByPk(req.params.id);
    sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.RESTAURANT_UPDATED,
      'Restaurant updated successfully',
      '레스토랑이 성공적으로 수정되었습니다',
      restaurant);
  } catch (error) {
    sendError(res, 400, RESPONSE_CODES.ERROR.VALIDATION_FAILED,
      'Failed to update restaurant',
      '레스토랑 수정에 실패했습니다',
      error.message);
  }
};

// 레스토랑 삭제
const deleteRestaurant = async (req, res) => {
  try {
    const deleted = await Restaurant.destroy({
      where: { id: req.params.id }
    });

    if (!deleted) {
      return commonErrors.notFound(res, 'Restaurant not found', '레스토랑을 찾을 수 없습니다');
    }

    sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.RESTAURANT_DELETED,
      'Restaurant deleted successfully',
      '레스토랑이 성공적으로 삭제되었습니다');
  } catch (error) {
    sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
      'Failed to delete restaurant',
      '레스토랑 삭제에 실패했습니다',
      error.message);
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
      return commonErrors.notFound(res, 'Restaurant not found', '레스토랑을 찾을 수 없습니다');
    }

    sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.RESTAURANT_DETAIL_GET,
      'Restaurant details retrieved successfully',
      '레스토랑 상세 정보를 성공적으로 조회했습니다',
      restaurant);
  } catch (error) {
    sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
      'Failed to retrieve restaurant details',
      '레스토랑 정보를 불러오는데 실패했습니다',
      error.message);
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
      return commonErrors.notFound(res, 'Restaurant not found', '레스토랑을 찾을 수 없습니다');
    }

    sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.RESTAURANT_DETAIL_GET,
      'Restaurant details retrieved successfully',
      '레스토랑 상세 정보를 성공적으로 조회했습니다',
      restaurant);
  } catch (error) {
    sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
      'Failed to retrieve restaurant details',
      '서버 오류가 발생했습니다',
      error.message);
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
    sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.REVIEW_LIST_GET,
      'Restaurant reviews retrieved successfully',
      '레스토랑 리뷰를 성공적으로 조회했습니다',
      reviews);
  } catch (error) {
    sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
      'Failed to retrieve restaurant reviews',
      '서버 오류가 발생했습니다',
      error.message);
  }
};

// 레스토랑 메뉴 목록 조회
const getRestaurantMenu = async (req, res) => {
  try {
    const menus = await prisma.menu.findMany({
      where: { restaurantId: req.params.id }
    });
    sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.DATA_RETRIEVED,
      'Restaurant menu retrieved successfully',
      '레스토랑 메뉴를 성공적으로 조회했습니다',
      menus);
  } catch (error) {
    sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
      'Failed to retrieve restaurant menu',
      '서버 오류가 발생했습니다',
      error.message);
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
    sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.DATA_RETRIEVED,
      'Reservation availability retrieved successfully',
      '예약 가능 시간을 성공적으로 조회했습니다',
      availableTimes);
  } catch (error) {
    sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
      'Failed to retrieve reservation availability',
      '서버 오류가 발생했습니다',
      error.message);
  }
};

// 레스토랑 리뷰 작성
const createRestaurantReview = async (req, res) => {
  try {
    const { userId, rating, content } = req.body;
    if (!userId || !rating || !content) {
      return commonErrors.validationError(res, 'Missing required fields', 'userId, rating, content는 필수입니다');
    }
    const review = await prisma.review.create({
      data: {
        restaurantId: req.params.id,
        userId,
        rating,
        content
      }
    });
    sendSuccess(res, 201, RESPONSE_CODES.SUCCESS.REVIEW_CREATED,
      'Restaurant review created successfully',
      '레스토랑 리뷰가 성공적으로 작성되었습니다',
      review);
  } catch (error) {
    sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
      'Failed to create restaurant review',
      '서버 오류가 발생했습니다',
      error.message);
  }
};

// Prometheus 메트릭 조회
const getMetrics = async (req, res) => {
  try {
    const prometheus = require('../config/prometheus');
    res.set('Content-Type', prometheus.register.contentType);
    res.end(await prometheus.register.metrics());
  } catch (error) {
    sendError(res, 500, RESPONSE_CODES.ERROR.INTERNAL_SERVER_ERROR,
      'Failed to retrieve metrics',
      '메트릭 조회에 실패했습니다',
      error.message);
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