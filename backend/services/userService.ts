import prisma from '../utils/prismaClient';

export const getUserById = (id: string) => prisma.user.findUnique({ where: { id } });
export const createUser = (data: any) => prisma.user.create({ data }); 