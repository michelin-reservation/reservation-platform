const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const naverAuthController = require('../controllers/naverAuthController');
const auth = require('../middleware/auth');

// 인증 관련 라우트
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/me', auth, authController.getCurrentUser);

// 네이버 로그인 라우트
router.get('/naver', naverAuthController.getNaverAuthUrl);
router.get('/naver/callback', naverAuthController.naverCallback);

module.exports = router; 