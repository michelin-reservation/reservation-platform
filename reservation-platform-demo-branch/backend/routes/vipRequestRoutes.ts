import express from 'express';
import * as vipRequestController from '../controllers/vipRequestController';
const router = express.Router();

router.post('/', vipRequestController.requestVip);
router.get('/user/:userId', vipRequestController.getVipRequestsByUser);

export default router; 