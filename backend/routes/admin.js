const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const adminOnly = require('../middleware/role')('관리자');
const { VipRequest } = require('../models');

// 관리자만 VIP 요청 승인 가능
router.put('/vip-requests/:id/approve', authenticateToken, adminOnly, async (req, res) => {
  try {
    const vipRequest = await VipRequest.findByPk(req.params.id);
    if (!vipRequest) return res.status(404).json({ message: 'VIP 요청을 찾을 수 없습니다.' });
    vipRequest.status = '승인';
    await vipRequest.save();
    res.json({ success: true, vipRequest });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router; 