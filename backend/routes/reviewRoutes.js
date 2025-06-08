const express = require('express');
const router = express.Router();
const { Review, User, Restaurant } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const reviewController = require('../controllers/reviewController');

// 리뷰 목록 조회
router.get('/', async (req, res) => {
  try {
    const { restaurant_id, user_id } = req.query;
    let where = {};
    if (restaurant_id) where.restaurant_id = restaurant_id;
    if (user_id) where.user_id = user_id;
    const reviews = await Review.findAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'name'] },
        { model: Restaurant, as: 'restaurant', attributes: ['id', 'name_korean'] }
      ],
      order: [['created_at', 'DESC']]
    });
    // 평탄화
    const result = reviews.map(r => ({
      id: r.id,
      user: r.user ? { id: r.user.id, name: r.user.name } : null,
      restaurant: r.restaurant ? { id: r.restaurant.id, nameKorean: r.restaurant.name_korean } : null,
      rating: r.rating,
      content: r.content,
      created_at: r.created_at
    }));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 리뷰 작성
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { restaurant_id, rating, content } = req.body;
    const user_id = req.user.user_id;
    const review = await Review.create({ user_id, restaurant_id, rating, content });
    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 리뷰 수정
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, content } = req.body;
    const user_id = req.user.user_id;
    const review = await Review.findOne({ where: { id, user_id } });
    if (!review) {
      return res.status(403).json({ message: '수정 권한이 없습니다.' });
    }
    review.rating = rating;
    review.content = content;
    await review.save();
    res.json({ message: '리뷰가 수정되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 리뷰 삭제
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.user_id;
    const review = await Review.findOne({ where: { id, user_id } });
    if (!review) {
      return res.status(403).json({ message: '삭제 권한이 없습니다.' });
    }
    await review.destroy();
    res.json({ message: '리뷰가 삭제되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 특정 식당의 리뷰 목록
router.get('/restaurants/:restaurant_id/reviews', async (req, res) => {
  try {
    const { restaurant_id } = req.params;
    const reviews = await Review.findAll({
      where: { restaurant_id },
      include: [
        { model: User, as: 'user', attributes: ['id', 'name'] },
        { model: Restaurant, as: 'restaurant', attributes: ['id', 'name_korean'] }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 특정 유저의 리뷰 목록
router.get('/users/:user_id/reviews', async (req, res) => {
  try {
    const { user_id } = req.params;
    const reviews = await Review.findAll({
      where: { user_id },
      include: [
        { model: User, as: 'user', attributes: ['id', 'name'] },
        { model: Restaurant, as: 'restaurant', attributes: ['id', 'name_korean'] }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 특정 식당의 리뷰 상세 조회
router.get('/restaurants/:restaurant_id/reviews/:review_id', reviewController.getReviewById);

// 특정 식당의 리뷰 수정
router.put('/restaurants/:restaurant_id/reviews/:review_id', authenticateToken, reviewController.updateReview);

// 특정 식당의 리뷰 삭제
router.delete('/restaurants/:restaurant_id/reviews/:review_id', authenticateToken, reviewController.deleteReview);

module.exports = router; 