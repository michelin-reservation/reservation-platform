const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const requireRole = require('../middlewares/role');
const vipRequestController = require('../controllers/vipRequestController');

// VIP 요청 등록
router.post('/', authenticateToken, vipRequestController.createVipRequest);

// 내 VIP 요청 목록 조회 (본인만 조회 가능)
router.get('/user/:user_id', authenticateToken, vipRequestController.getUserVipRequests);

// 모든 VIP 요청 목록 조회 (관리자용)
router.get('/', authenticateToken, requireRole(['관리자']), vipRequestController.getAllVipRequests);

// 특정 VIP 요청 상세 조회
router.get('/:id', authenticateToken, vipRequestController.getVipRequestById);

// VIP 요청 삭제
router.delete('/:id', authenticateToken, vipRequestController.deleteVipRequest);

module.exports = router;