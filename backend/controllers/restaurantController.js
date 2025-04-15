const Restaurant = require('../models/Restaurant');

const restaurantController = {
  // 모든 레스토랑 조회
  getAllRestaurants: async (req, res) => {
    try {
      const restaurants = await Restaurant.find().select('-reviews -reservations');
      res.json(restaurants);
    } catch (error) {
      res.status(500).json({ message: '레스토랑 목록을 불러오는데 실패했습니다.', error: error.message });
    }
  },

  // 레스토랑 검색
  searchRestaurants: async (req, res) => {
    try {
      const { keyword, cuisine, priceRange, location, page = 1, limit = 10 } = req.query;
      const query = {};

      if (keyword) {
        query.$or = [
          { name: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } }
        ];
      }
      if (cuisine) query.cuisine = cuisine;
      if (priceRange) query.priceRange = priceRange;
      if (location) {
        query.location = {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: location.split(',').map(Number)
            },
            $maxDistance: 10000 // 10km 반경
          }
        };
      }

      const skip = (page - 1) * limit;
      const restaurants = await Restaurant.find(query)
        .select('-reviews -reservations')
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Restaurant.countDocuments(query);

      res.json({
        restaurants,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total
      });
    } catch (error) {
      res.status(500).json({ message: '레스토랑 검색에 실패했습니다.', error: error.message });
    }
  },

  // 레스토랑 생성
  createRestaurant: async (req, res) => {
    try {
      const restaurant = new Restaurant(req.body);
      const savedRestaurant = await restaurant.save();
      res.status(201).json(savedRestaurant);
    } catch (error) {
      res.status(400).json({ message: '레스토랑 생성에 실패했습니다.', error: error.message });
    }
  },

  // 레스토랑 수정
  updateRestaurant: async (req, res) => {
    try {
      const restaurant = await Restaurant.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true }
      );
      if (!restaurant) {
        return res.status(404).json({ message: '레스토랑을 찾을 수 없습니다.' });
      }
      res.json(restaurant);
    } catch (error) {
      res.status(400).json({ message: '레스토랑 수정에 실패했습니다.', error: error.message });
    }
  },

  // 레스토랑 삭제
  deleteRestaurant: async (req, res) => {
    try {
      const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
      if (!restaurant) {
        return res.status(404).json({ message: '레스토랑을 찾을 수 없습니다.' });
      }
      res.json({ message: '레스토랑이 성공적으로 삭제되었습니다.' });
    } catch (error) {
      res.status(500).json({ message: '레스토랑 삭제에 실패했습니다.', error: error.message });
    }
  },

  // 레스토랑 상세 정보 조회
  getRestaurantDetails: async (req, res) => {
    try {
      const restaurant = await Restaurant.findById(req.params.id)
        .populate('reviews')
        .populate('reservations');
      
      if (!restaurant) {
        return res.status(404).json({ message: '레스토랑을 찾을 수 없습니다.' });
      }
      res.json(restaurant);
    } catch (error) {
      res.status(500).json({ message: '레스토랑 정보를 불러오는데 실패했습니다.', error: error.message });
    }
  }
};

module.exports = restaurantController; 