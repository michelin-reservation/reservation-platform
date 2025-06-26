import express from 'express';
import { authenticateToken } from '../middlewares/auth';
import * as vipBenefitController from '../controllers/vipBenefitController';

const router = express.Router();

// VIP 혜택 목록 조회
router.get('/', authenticateToken, vipBenefitController.getVipBenefits);

// VIP 혜택 사용
router.post('/:benefitId/use', authenticateToken, vipBenefitController.useVipBenefit);

export default router; 