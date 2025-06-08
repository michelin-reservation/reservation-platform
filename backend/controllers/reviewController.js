const { Review, User, Restaurant } = require('../models');

exports.getReviewById = async (req, res, next) => {
  try {
    const { restaurant_id, review_id } = req.params;
    const review = await Review.findOne({
      where: { id: review_id, restaurant_id },
      include: [
        { model: User, as: 'user', attributes: ['id', 'name'] },
        { model: Restaurant, as: 'restaurant', attributes: ['id', 'name_korean'] }
      ]
    });
    if (!review) return res.status(404).json({ message: '리뷰를 찾을 수 없습니다.' });
    res.json(review);
  } catch (err) {
    next(err);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    const { restaurant_id, review_id } = req.params;
    const { rating, content } = req.body;
    const user_id = req.user.user_id;
    const review = await Review.findOne({ where: { id: review_id, restaurant_id, user_id } });
    if (!review) return res.status(403).json({ message: '수정 권한이 없습니다.' });
    review.rating = rating;
    review.content = content;
    await review.save();
    res.json({ message: '리뷰가 수정되었습니다.' });
  } catch (err) {
    next(err);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const { restaurant_id, review_id } = req.params;
    const user_id = req.user.user_id;
    const review = await Review.findOne({ where: { id: review_id, restaurant_id, user_id } });
    if (!review) return res.status(403).json({ message: '삭제 권한이 없습니다.' });
    await review.destroy();
    res.json({ message: '리뷰가 삭제되었습니다.' });
  } catch (err) {
    next(err);
  }
};

exports.getUserReviews = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const reviews = await Review.findAll({
      where: { user_id },
      include: [
        { model: User, as: 'user', attributes: ['id', 'name'] },
        { model: Restaurant, as: 'restaurant', attributes: ['id', 'name_korean'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: reviews });
  } catch (err) {
    next(err);
  }
}; 