const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');

// 회원가입
router.post('/signup', userController.signup);

// 로그인
router.post('/login', userController.login);

// 프로필 조회 (인증 필요)
router.get('/profile', authMiddleware, userController.getProfile);

module.exports = router; 