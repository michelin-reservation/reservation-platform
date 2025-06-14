import express from 'express';
import { authenticate } from '../middlewares/auth';
import * as reviewController from '../controllers/reviewController';

const router = express.Router();

// 리뷰 목록 조회 (식당/유저별)
router.get('/', reviewController.getReviews);

// 리뷰 작성
router.post('/', authenticate, reviewController.createReview);

// 리뷰 수정
router.put('/:id', authenticate, reviewController.updateReview);

// 리뷰 삭제
router.delete('/:id', authenticate, reviewController.deleteReview);

// 특정 식당의 리뷰 목록
router.get('/restaurants/:restaurantId/reviews', reviewController.getReviewsByRestaurant);

// 특정 유저의 리뷰 목록
router.get('/users/:userId/reviews', reviewController.getReviewsByUser);

// 특정 식당의 리뷰 상세 조회
router.get('/restaurants/:restaurantId/reviews/:reviewId', reviewController.getReviewById);

// 특정 식당의 리뷰 수정
router.put('/restaurants/:restaurantId/reviews/:reviewId', authenticate, reviewController.updateReview);

// 특정 식당의 리뷰 삭제
router.delete('/restaurants/:restaurantId/reviews/:reviewId', authenticate, reviewController.deleteReview);

export default router;