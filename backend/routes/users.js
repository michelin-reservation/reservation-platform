const express = require('express');
const router = express.Router();
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: 회원가입
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               user_type:
 *                 type: string
 *                 enum: [일반, VIP, 관리자]
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *       400:
 *         description: 잘못된 요청
 */
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name, phone, user_type, company_name, vip_card_number } = req.body;
    const user = await User.create({ email, password, name, phone, user_type, company_name, vip_card_number });
    res.status(201).json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: 로그인
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: 인증 실패
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }
    const token = jwt.sign({ user_id: user.user_id, user_type: user.user_type }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: 내 정보 조회
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 사용자 정보 조회 성공
 *       401:
 *         description: 인증 필요
 *       403:
 *         description: 권한 없음
 */
router.get('/me', auth, async (req, res) => {
  const user = await User.findByPk(req.user.user_id);
  if (!user) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
  if (user.user_id !== req.user.user_id) {
    return res.status(403).json({ message: '본인 정보만 조회할 수 있습니다.' });
  }
  res.json(user);
});

module.exports = router; 