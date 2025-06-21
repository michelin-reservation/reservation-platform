const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');
const { authenticateToken } = require('../middlewares/auth.js');
const { getNaverAuthUrl, naverCallback } = require('../controllers/naverAuthController.js');

// 인증 관련 라우트
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/me', authenticateToken, authController.getCurrentUser);

// 네이버 로그인 라우트
router.get('/naver', getNaverAuthUrl);
router.get('/naver/callback', naverCallback);

module.exports = router;