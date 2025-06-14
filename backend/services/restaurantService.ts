import prisma from '../utils/prismaClient';

export const getAllRestaurants = () => prisma.restaurant.findMany();
export const getRestaurantById = (id: string) => prisma.restaurant.findUnique({ where: { id } }); 