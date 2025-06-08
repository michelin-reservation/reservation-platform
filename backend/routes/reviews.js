const express = require('express');
const router = express.Router();
const { Review } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// 리뷰 등록
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { restaurant_id, rating, content } = req.body;
    const user_id = req.user.user_id;
    const review = await Review.create({ user_id, restaurant_id, rating, content });
    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 식당별 리뷰 목록
router.get('/restaurant/:restaurant_id', async (req, res) => {
  const reviews = await Review.findAll({ where: { restaurant_id: req.params.restaurant_id } });
  res.json(reviews);
});

// 본인 리뷰 삭제
router.delete('/:review_id', authenticateToken, async (req, res) => {
  const review = await Review.findByPk(req.params.review_id);
  if (!review) return res.status(404).json({ message: '리뷰를 찾을 수 없습니다.' });
  if (review.user_id !== req.user.user_id) {
    return res.status(403).json({ message: '본인 리뷰만 삭제할 수 있습니다.' });
  }
  await review.destroy();
  res.json({ message: '리뷰가 성공적으로 삭제되었습니다.' });
});

module.exports = router; 