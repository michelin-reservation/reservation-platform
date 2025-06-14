import { Request, Response } from 'express';
import * as reservationService from '../services/reservationService';

export const createReservation = async (req: Request, res: Response) => {
  const reservation = await reservationService.createReservation(req.body);
  res.json(reservation);
};

export const getReservationsByUser = async (req: Request, res: Response) => {
  const reservations = await reservationService.getReservationsByUser(req.params.userId);
  res.json(reservations);
}; 