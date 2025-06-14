import express from 'express';
import * as paymentController from '../controllers/paymentController';
const router = express.Router();

router.post('/', paymentController.createPayment);
router.get('/user/:userId', paymentController.getPaymentsByUser);

export default router; 