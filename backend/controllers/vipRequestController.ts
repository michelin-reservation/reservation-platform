import { Request, Response } from 'express';
import * as vipRequestService from '../services/vipRequestService';

export const requestVip = async (req: Request, res: Response) => {
  const vip = await vipRequestService.requestVip(req.body);
  res.json(vip);
};

export const getVipRequestsByUser = async (req: Request, res: Response) => {
  const vipRequests = await vipRequestService.getVipRequestsByUser(req.params.userId);
  res.json(vipRequests);
}; 