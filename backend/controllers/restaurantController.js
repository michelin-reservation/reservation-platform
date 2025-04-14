const Restaurant = require('../models/Restaurant');

// 모든 레스토랑 조회
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 레스토랑 검색
exports.searchRestaurants = async (req, res) => {
  try {
    const {
      query,          // 검색어
      district,       // 지역구
      cuisine,        // 음식 종류
      michelinStatus, // 미슐랭 등급
      page = 1,
      limit = 10
    } = req.query;

    const filter = {};

    // 텍스트 검색 조건
    if (query) {
      filter.$text = { $search: query };
    }

    // 지역구 필터
    if (district) {
      filter['location.district'] = district;
    }

    // 음식 종류 필터
    if (cuisine) {
      filter.cuisine = cuisine;
    }

    // 미슐랭 등급 필터
    if (michelinStatus) {
      filter.michelinStatus = michelinStatus;
    }

    const skip = (page - 1) * limit;

    // 검색 실행
    const restaurants = await Restaurant.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ 'name': 1 });

    // 총 결과 수 계산
    const total = await Restaurant.countDocuments(filter);

    res.json({
      restaurants,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 레스토랑 생성
exports.createRestaurant = async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    const savedRestaurant = await restaurant.save();
    res.status(201).json(savedRestaurant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 레스토랑 수정
exports.updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!restaurant) {
      return res.status(404).json({ message: '레스토랑을 찾을 수 없습니다.' });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 레스토랑 삭제
exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: '레스토랑을 찾을 수 없습니다.' });
    }
    res.status(200).json({ message: '레스토랑이 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 레스토랑 상세 조회
exports.getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: '레스토랑을 찾을 수 없습니다.' });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 