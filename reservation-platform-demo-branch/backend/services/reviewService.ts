import prisma from '../utils/prismaClient';

export const addReview = (data: any) => prisma.review.create({ data });
export const getReviewsByRestaurant = (restaurantId: string) => prisma.review.findMany({ where: { restaurantId }, include: { user: true } }); 