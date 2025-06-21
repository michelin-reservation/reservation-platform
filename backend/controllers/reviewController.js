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
    const user_id = req.user.id;
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
    const user_id = req.user.id;
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

exports.createReview = async (req, res, next) => {
  try {
    const { restaurant_id } = req.params;
    const { rating, content } = req.body;
    const user_id = req.user.id;

    // 입력값 검증
    if (!rating || !content) {
      return res.status(400).json({
        message: '평점과 리뷰 내용은 필수입니다.'
      });
    }

    // 평점 범위 검증 (1-5점)
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: '평점은 1점에서 5점 사이여야 합니다.'
      });
    }

    // 리뷰 내용 길이 검증
    if (content.length < 10) {
      return res.status(400).json({
        message: '리뷰 내용은 최소 10자 이상 작성해주세요.'
      });
    }

    // 식당 존재 여부 확인
    const restaurant = await Restaurant.findByPk(restaurant_id);
    if (!restaurant) {
      return res.status(404).json({
        message: '존재하지 않는 식당입니다.'
      });
    }

    // 중복 리뷰 방지 - 같은 사용자가 같은 식당에 이미 리뷰를 작성했는지 확인
    const existingReview = await Review.findOne({
      where: { user_id, restaurant_id }
    });

    if (existingReview) {
      return res.status(409).json({
        message: '이미 해당 식당에 리뷰를 작성하셨습니다.'
      });
    }

    // 리뷰 생성
    const review = await Review.create({
      user_id,
      restaurant_id,
      rating,
      content,
      created_at: new Date()
    });

    // 생성된 리뷰를 사용자와 식당 정보와 함께 조회
    const createdReview = await Review.findOne({
      where: { id: review.id },
      include: [
        { model: User, as: 'user', attributes: ['id', 'name'] },
        { model: Restaurant, as: 'restaurant', attributes: ['id', 'name_korean'] }
      ]
    });

    res.status(201).json({
      message: '리뷰가 성공적으로 작성되었습니다.',
      review: createdReview
    });

  } catch (err) {
    console.error('리뷰 작성 오류:', err);
    next(err);
  }
};