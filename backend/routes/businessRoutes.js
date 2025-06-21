const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const { requireRole } = require('../middlewares/role');
const businessController = require('../controllers/businessController');

// --- 사용자/신청자용 라우트 ---

/**
 * @swagger
 * /business/apply:
 *   post:
 *     summary: 사업자 등록 신청
 *     tags: [Business]
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
 *                 description: 사업자명
 *     responses:
 *       201:
 *         description: 신청 성공
 *       409:
 *         description: 이미 신청 내역이 존재함
 */
router.post(
    '/apply',
    authenticateToken,
    requireRole(['일반', 'VIP']),
    businessController.applyBusiness
);

/**
 * @swagger
 * /business/my-status:
 *   get:
 *     summary: 내 사업자 신청 상태 조회
 *     tags: [Business]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 조회 성공
 *       404:
 *         description: 신청 내역 없음
 */
router.get(
    '/my-status',
    authenticateToken,
    businessController.getMyBusinessStatus
);

// --- 승인된 사업자용 라우트 ---

/**
 * @swagger
 * /business/settings:
 *   get:
 *     summary: 사업자 설정 조회
 *     tags: [Business]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 조회 성공
 */
router.get(
    '/settings',
    authenticateToken,
    requireRole(['사업자']),
    businessController.getBusinessSettings
);

/**
 * @swagger
 * /business/settings:
 *   put:
 *     summary: 사업자 설정 수정
 *     tags: [Business]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 수정 성공
 */
router.put(
    '/settings',
    authenticateToken,
    requireRole(['사업자']),
    businessController.updateBusinessSettings
);

/**
 * @swagger
 * /business/statistics:
 *   get:
 *     summary: 사업자 통계 조회
 *     tags: [Business]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 조회 성공
 */
router.get(
    '/statistics',
    authenticateToken,
    requireRole(['사업자']),
    businessController.getBusinessStatistics
);

// --- 관리자용 라우트 ---

/**
 * @swagger
 * /business/all:
 *   get:
 *     summary: (관리자) 전체 사업자 신청 목록 조회
 *     tags: [Business]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *       - in: query
 *         name: limit
 *       - in: query
 *         name: search
 *       - in: query
 *         name: status
 *     responses:
 *       200:
 *         description: 조회 성공
 */
router.get(
    '/all',
    authenticateToken,
    requireRole(['관리자']),
    businessController.getAllBusinessApplications
);

/**
 * @swagger
 * /business/{id}/status:
 *   patch:
 *     summary: (관리자) 사업자 신청 상태 변경 (승인/거절)
 *     tags: [Business]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [승인, 거절]
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: 상태 변경 성공
 */
router.patch(
    '/:id/status',
    authenticateToken,
    requireRole(['관리자']),
    businessController.updateBusinessStatus
);

module.exports = router;