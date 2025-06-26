import express from 'express';
import { authenticateToken } from '../middlewares/auth';
import * as vipConciergeController from '../controllers/vipConciergeController';

const router = express.Router();

// VIP 컨시어지 요청
router.post('/', authenticateToken, vipConciergeController.requestConcierge);

export default router; 