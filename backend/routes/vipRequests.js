const express = require('express');
const router = express.Router();
const { VipRequest } = require('../models');
const { authenticateToken } = require('../middlewares/auth');

// VIP 요청 등록
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { company_name, itinerary } = req.body;
    const user_id = req.user.user_id;
    const vipRequest = await VipRequest.create({ user_id, company_name, itinerary });
    res.status(201).json({ success: true, vipRequest });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 내 VIP 요청 목록 (본인만 조회 가능)
router.get('/user/:user_id', authenticateToken, async (req, res) => {
  if (parseInt(req.user.user_id) !== parseInt(req.params.user_id)) {
    return res.status(403).json({ message: '본인만 VIP 요청 목록을 조회할 수 있습니다.' });
  }
  const vipRequests = await VipRequest.findAll({ where: { user_id: req.params.user_id } });
  res.json(vipRequests);
});

module.exports = router;