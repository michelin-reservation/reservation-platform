import prisma from '../utils/prismaClient';

export const createPayment = (data: any) => prisma.payment.create({ data });
export const getPaymentsByUser = (userId: string) => prisma.payment.findMany({ where: { userId } }); 