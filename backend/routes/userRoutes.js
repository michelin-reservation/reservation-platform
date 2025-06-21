const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth.js');
const userController = require('../controllers/userController.js');
const reservationController = require('../controllers/reservationController.js');
const reviewController = require('../controllers/reviewController.js');

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
router.get('/me', authenticateToken, userController.getProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: 프로필 수정
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               company_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: 프로필 수정 성공
 *       401:
 *         description: 인증 필요
 */
router.put('/profile', authenticateToken, userController.updateProfile);

/**
 * @swagger
 * /api/users/notifications:
 *   get:
 *     summary: 알림 설정 조회
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 알림 설정 조회 성공
 *       401:
 *         description: 인증 필요
 */
router.get('/notifications', authenticateToken, userController.getNotificationSettings);

/**
 * @swagger
 * /api/users/notifications:
 *   put:
 *     summary: 알림 설정 업데이트
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email_notifications:
 *                 type: boolean
 *               push_notifications:
 *                 type: boolean
 *               sms_notifications:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: 알림 설정 업데이트 성공
 *       401:
 *         description: 인증 필요
 */
router.put('/notifications', authenticateToken, userController.updateNotificationSettings);

/**
 * @swagger
 * /api/users/{user_id}/reservations:
 *   get:
 *     summary: 사용자의 예약 목록 조회
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 사용자 ID
 *     responses:
 *       200:
 *         description: 예약 목록 조회 성공
 *       401:
 *         description: 인증 필요
 *       403:
 *         description: 권한 없음
 */
router.get('/:user_id/reservations', authenticateToken, reservationController.getUserReservations);

/**
 * @swagger
 * /api/users/{user_id}/reviews:
 *   get:
 *     summary: 사용자의 리뷰 목록 조회
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 사용자 ID
 *     responses:
 *       200:
 *         description: 리뷰 목록 조회 성공
 *       401:
 *         description: 인증 필요
 *       403:
 *         description: 권한 없음
 */
router.get('/:user_id/reviews', authenticateToken, reviewController.getUserReviews);

module.exports = router;