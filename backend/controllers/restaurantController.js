const { Restaurant, Review, Reservation } = require('../models');
const { Op } = require('sequelize');

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

// 레스토랑 상세 정보 조회
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

module.exports = {
  getAllRestaurants,
  searchRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantDetails
}; 