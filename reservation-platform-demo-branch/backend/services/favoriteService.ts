import prisma from '../utils/prismaClient';

export const addFavorite = (data: any) => prisma.favorite.create({ data });
export const getFavoritesByUser = (userId: string) => prisma.favorite.findMany({ where: { userId }, include: { restaurant: true } });
export const deleteFavorite = (id: string) => prisma.favorite.delete({ where: { id } }); 