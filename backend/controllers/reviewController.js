const { Review, User, Restaurant } = require('../models');
const { sendSuccess, sendError, commonErrors, RESPONSE_CODES } = require('../utils/responseHelper');

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
    if (!review) {
      return commonErrors.notFound(res, 'Review not found', '리뷰를 찾을 수 없습니다');
    }
    sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.REVIEW_LIST_GET,
      'Review retrieved successfully',
      '리뷰를 성공적으로 조회했습니다',
      review);
  } catch (err) {
    sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
      'Failed to retrieve review',
      '리뷰 조회 중 오류가 발생했습니다',
      err.message);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    const { restaurant_id, review_id } = req.params;
    const { rating, content } = req.body;
    const user_id = req.user.id;
    const review = await Review.findOne({ where: { id: review_id, restaurant_id, user_id } });
    if (!review) {
      return commonErrors.forbidden(res, 'No permission to update review', '수정 권한이 없습니다');
    }
    review.rating = rating;
    review.content = content;
    await review.save();
    sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.REVIEW_UPDATED,
      'Review updated successfully',
      '리뷰가 수정되었습니다',
      review);
  } catch (err) {
    sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
      'Failed to update review',
      '리뷰 수정 중 오류가 발생했습니다',
      err.message);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const { restaurant_id, review_id } = req.params;
    const user_id = req.user.id;
    const review = await Review.findOne({ where: { id: review_id, restaurant_id, user_id } });
    if (!review) {
      return commonErrors.forbidden(res, 'No permission to delete review', '삭제 권한이 없습니다');
    }
    await review.destroy();
    sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.REVIEW_DELETED,
      'Review deleted successfully',
      '리뷰가 삭제되었습니다');
  } catch (err) {
    sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
      'Failed to delete review',
      '리뷰 삭제 중 오류가 발생했습니다',
      err.message);
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
    sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.REVIEW_LIST_GET,
      'User reviews retrieved successfully',
      '사용자 리뷰 목록을 성공적으로 조회했습니다',
      reviews);
  } catch (err) {
    sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
      'Failed to retrieve user reviews',
      '사용자 리뷰 조회 중 오류가 발생했습니다',
      err.message);
  }
};

exports.createReview = async (req, res, next) => {
  try {
    const { restaurant_id } = req.params;
    const { rating, content } = req.body;
    const user_id = req.user.id;

    // 입력값 검증
    if (!rating || !content) {
      return commonErrors.validationError(res, 'Missing required fields', '평점과 리뷰 내용은 필수입니다');
    }

    // 평점 범위 검증 (1-5점)
    if (rating < 1 || rating > 5) {
      return commonErrors.validationError(res, 'Invalid rating range', '평점은 1점에서 5점 사이여야 합니다');
    }

    // 리뷰 내용 길이 검증
    if (content.length < 10) {
      return commonErrors.validationError(res, 'Review content too short', '리뷰 내용은 최소 10자 이상 작성해주세요');
    }

    // 식당 존재 여부 확인
    const restaurant = await Restaurant.findByPk(restaurant_id);
    if (!restaurant) {
      return commonErrors.notFound(res, 'Restaurant not found', '존재하지 않는 식당입니다');
    }

    // 중복 리뷰 방지 - 같은 사용자가 같은 식당에 이미 리뷰를 작성했는지 확인
    const existingReview = await Review.findOne({
      where: { user_id, restaurant_id }
    });

    if (existingReview) {
      return sendError(res, 409, RESPONSE_CODES.ERROR.RESOURCE_CONFLICT,
        'Duplicate review exists',
        '이미 해당 식당에 리뷰를 작성하셨습니다');
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

    sendSuccess(res, 201, RESPONSE_CODES.SUCCESS.REVIEW_CREATED,
      'Review created successfully',
      '리뷰가 성공적으로 작성되었습니다',
      createdReview);

  } catch (err) {
    console.error('리뷰 작성 오류:', err);
    sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
      'Failed to create review',
      '리뷰 작성 중 오류가 발생했습니다',
      err.message);
  }
};