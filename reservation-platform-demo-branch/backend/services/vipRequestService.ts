import prisma from '../utils/prismaClient';

export const requestVip = (data: any) => prisma.vipRequest.create({ data });
export const getVipRequestsByUser = (userId: string) => prisma.vipRequest.findMany({ where: { userId } }); 