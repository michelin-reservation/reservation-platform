const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const favoriteController = require('../controllers/favoriteController');

// 관심 목록 조회
router.get('/', authenticateToken, favoriteController.getFavorites);

// 관심 목록 추가
router.post('/', authenticateToken, favoriteController.addFavorite);

// 관심 목록 삭제
router.delete('/:restaurant_id', authenticateToken, favoriteController.removeFavorite);

// 특정 식당의 관심 목록 여부 확인
router.get('/check/:restaurant_id', authenticateToken, favoriteController.checkFavorite);

// 사용자별 관심 목록 개수 조회
router.get('/count', authenticateToken, favoriteController.getFavoriteCount);

module.exports = router;