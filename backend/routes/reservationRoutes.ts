import express from 'express';
import * as reservationController from '../controllers/reservationController';
const router = express.Router();

router.post('/', reservationController.createReservation);
router.get('/user/:userId', reservationController.getReservationsByUser);

export default router; 