import { Request, Response } from 'express';
import * as paymentService from '../services/paymentService';

export const createPayment = async (req: Request, res: Response) => {
  const payment = await paymentService.createPayment(req.body);
  res.json(payment);
};

export const getPaymentsByUser = async (req: Request, res: Response) => {
  const payments = await paymentService.getPaymentsByUser(req.params.userId);
  res.json(payments);
}; 