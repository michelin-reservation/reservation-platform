import { Request, Response } from 'express';
import * as paymentService from '../services/paymentService';
import { sendSuccess, sendError, commonErrors, RESPONSE_CODES } from '../utils/responseHelper';

export const createPayment = async (req: Request, res: Response) => {
  try {
    const payment = await paymentService.createPayment(req.body);
    sendSuccess(res, 201, RESPONSE_CODES.SUCCESS.PAYMENT_CREATED,
      'Payment created successfully',
      '결제가 성공적으로 생성되었습니다',
      payment);
  } catch (error) {
    sendError(res, 500, RESPONSE_CODES.ERROR.PAYMENT_FAILED,
      'Failed to create payment',
      '결제 생성에 실패했습니다',
      error instanceof Error ? error.message : 'Unknown error');
  }
};

export const getPaymentsByUser = async (req: Request, res: Response) => {
  try {
    const payments = await paymentService.getPaymentsByUser(req.params.userId);
    sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.PAYMENT_LIST_GET,
      'User payments retrieved successfully',
      '사용자 결제 내역을 성공적으로 조회했습니다',
      payments);
  } catch (error) {
    sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
      'Failed to retrieve user payments',
      '결제 내역 조회에 실패했습니다',
      error instanceof Error ? error.message : 'Unknown error');
  }
};