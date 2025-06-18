const express = require('express');
const router = express.Router();
const { Favorite, Restaurant } = require('../models');
const { authenticateToken } = require('../middlewares/auth');

// 관심 목록 조회
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const favorites = await Favorite.findAll({
      where: { user_id },
      include: [{
        model: Restaurant,
        as: 'restaurant',
        attributes: [
          ['id', 'restaurant_id'],
          ['name_korean', 'nameKorean'],
          'address',
          'image',
          'type',
          'rating'
        ]
      }],
      order: [['created_at', 'DESC']]
    });

    // 프론트 요구에 맞게 평탄화
    const result = favorites.map(fav => ({
      restaurant_id: fav.restaurant?.restaurant_id,
      nameKorean: fav.restaurant?.nameKorean,
      address: fav.restaurant?.address,
      image: fav.restaurant?.image,
      type: fav.restaurant?.type,
      rating: fav.restaurant?.rating
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 관심 목록 추가
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { restaurant_id } = req.body;
    const user_id = req.user.user_id;
    // 이미 관심 목록에 있는지 확인
    const existing = await Favorite.findOne({ where: { user_id, restaurant_id } });
    if (existing) {
      return res.status(400).json({ message: '이미 관심 목록에 추가되어 있습니다.' });
    }
    const favorite = await Favorite.create({ user_id, restaurant_id });
    res.status(201).json(favorite);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 관심 목록 삭제
router.delete('/:restaurant_id', authenticateToken, async (req, res) => {
  try {
    const { restaurant_id } = req.params;
    const user_id = req.user.user_id;
    const deleted = await Favorite.destroy({ where: { user_id, restaurant_id } });
    if (deleted) {
      res.json({ message: '관심 목록에서 제거되었습니다.' });
    } else {
      res.status(404).json({ message: '관심 목록에 해당 식당이 없습니다.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;