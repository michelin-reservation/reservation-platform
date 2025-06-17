import prisma from '../utils/prismaClient';

export const createReservation = (data: any) => prisma.reservation.create({ data });
export const getReservationsByUser = (userId: string) => prisma.reservation.findMany({ where: { userId } });