import express from 'express';
import * as userController from '../controllers/userController';
import { authenticateToken } from '../middlewares/auth';

const router = express.Router();

router.get('/:id', userController.getUser);
router.post('/', userController.createUser);

// VIP 통계 조회
router.get('/:userId/vip-stats', authenticateToken, userController.getVipStats);

// VIP 예약 목록 조회
router.get('/:userId/vip-reservations', authenticateToken, userController.getVipReservations);

export default router; 