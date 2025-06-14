import { Request, Response } from 'express';
import prisma from '../utils/prismaClient';

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
};

export const getAllReservations = async (req: Request, res: Response) => {
  const reservations = await prisma.reservation.findMany({
    include: { user: true, restaurant: true }
  });
  res.json(reservations);
};

export const getAllVipRequests = async (req: Request, res: Response) => {
  const vipRequests = await prisma.vipRequest.findMany({
    include: { user: true }
  });
  res.json(vipRequests);
}; 