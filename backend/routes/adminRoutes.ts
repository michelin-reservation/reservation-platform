import express from 'express';
import { authenticate, isAdmin } from '../middlewares/auth';
import * as adminController from '../controllers/adminController';

const router = express.Router();

router.use(authenticate, isAdmin); // 관리자 보호 미들웨어

router.get('/users', adminController.getAllUsers);
router.get('/reservations', adminController.getAllReservations);
router.get('/vip-requests', adminController.getAllVipRequests);

export default router; 