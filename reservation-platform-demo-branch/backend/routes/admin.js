const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const requireRole = require('../middlewares/role');
const adminController = require('../controllers/adminController');
const vipRequestController = require('../controllers/vipRequestController');

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: 관리자 대시보드 데이터 조회
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 대시보드 데이터 조회 성공
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 부족
 */
router.get('/dashboard', authenticateToken, requireRole(['관리자']), adminController.getAdminDashboard);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: 모든 사용자 목록 조회
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: 페이지당 항목 수
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 검색어 (이름 또는 이메일)
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: 사용자 역할 필터
 *     responses:
 *       200:
 *         description: 사용자 목록 조회 성공
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 부족
 */
router.get('/users', authenticateToken, requireRole(['관리자']), adminController.getAllUsers);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     summary: 특정 사용자 상세 정보 조회
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 사용자 ID
 *     responses:
 *       200:
 *         description: 사용자 상세 정보 조회 성공
 *       404:
 *         description: 사용자를 찾을 수 없음
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 부족
 */
router.get('/users/:id', authenticateToken, requireRole(['관리자']), adminController.getUserById);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: 사용자 삭제
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 사용자 ID
 *     responses:
 *       200:
 *         description: 사용자 삭제 성공
 *       400:
 *         description: 본인 계정 또는 관리자 계정 삭제 불가
 *       404:
 *         description: 사용자를 찾을 수 없음
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 부족
 */
router.delete('/users/:id', authenticateToken, requireRole(['관리자']), adminController.deleteUser);

/**
 * @swagger
 * /api/admin/users/{id}/role:
 *   put:
 *     summary: 사용자 역할 변경
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 사용자 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [일반, VIP, 관리자]
 *                 description: 새로운 역할
 *     responses:
 *       200:
 *         description: 역할 변경 성공
 *       400:
 *         description: 유효하지 않은 역할 또는 본인 역할 변경 불가
 *       404:
 *         description: 사용자를 찾을 수 없음
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 부족
 */
router.put('/users/:id/role', authenticateToken, requireRole(['관리자']), adminController.updateUserRole);

/**
 * @swagger
 * /api/admin/reservations:
 *   get:
 *     summary: 모든 예약 목록 조회
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: 페이지당 항목 수
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: 예약 상태 필터
 *       - in: query
 *         name: restaurant_id
 *         schema:
 *           type: integer
 *         description: 레스토랑 ID 필터
 *     responses:
 *       200:
 *         description: 예약 목록 조회 성공
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 부족
 */
router.get('/reservations', authenticateToken, requireRole(['관리자']), adminController.getAllReservations);

/**
 * @swagger
 * /admin/reviews:
 *   get:
 *     summary: 모든 리뷰 목록 조회
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: 페이지당 항목 수
 *       - in: query
 *         name: restaurant_id
 *         schema:
 *           type: integer
 *         description: 레스토랑 ID 필터
 *       - in: query
 *         name: rating
 *         schema:
 *           type: integer
 *         description: 평점 필터
 *     responses:
 *       200:
 *         description: 리뷰 목록 조회 성공
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 부족
 */
router.get('/reviews', authenticateToken, requireRole(['관리자']), adminController.getAllReviews);

/**
 * @swagger
 * /admin/reviews/{id}:
 *   delete:
 *     summary: 리뷰 삭제
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 리뷰 ID
 *     responses:
 *       200:
 *         description: 리뷰 삭제 성공
 *       404:
 *         description: 리뷰를 찾을 수 없음
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 부족
 */
router.delete('/reviews/:id', authenticateToken, requireRole(['관리자']), adminController.deleteReview);

/**
 * @swagger
 * /admin/vip-requests:
 *   get:
 *     summary: 모든 VIP 요청 목록 조회
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: 페이지당 항목 수
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: 상태 필터
 *     responses:
 *       200:
 *         description: VIP 요청 목록 조회 성공
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 부족
 */
router.get('/vip-requests', authenticateToken, requireRole(['관리자']), adminController.getAllVipRequests);

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: 시스템 통계 조회
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 시스템 통계 조회 성공
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 부족
 */
router.get('/stats', authenticateToken, requireRole(['관리자']), adminController.getSystemStats);

/**
 * @swagger
 * /admin/vip-requests/{id}/approve:
 *   put:
 *     summary: (관리자) VIP 요청 승인
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: VIP 요청 ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: VIP 요청 승인 성공
 */
router.put('/vip-requests/:id/approve', authenticateToken, requireRole(['관리자']), vipRequestController.approveVipRequest);

/**
 * @swagger
 * /admin/vip-requests/{id}/reject:
 *   put:
 *     summary: (관리자) VIP 요청 거절
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: VIP 요청 ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 description: 거절 사유
 *     responses:
 *       200:
 *         description: VIP 요청 거절 성공
 */
router.put('/vip-requests/:id/reject', authenticateToken, requireRole(['관리자']), vipRequestController.rejectVipRequest);

/**
 * @swagger
 * /admin/vip-requests/stats:
 *   get:
 *     summary: (관리자) VIP 요청 통계 조회
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: VIP 요청 통계 조회 성공
 */
router.get('/vip-requests/stats', authenticateToken, requireRole(['관리자']), vipRequestController.getVipRequestStats);

module.exports = router;