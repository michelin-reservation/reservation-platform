import { Request, Response } from 'express';
import prisma from '../utils/prismaClient';

// 전체 리뷰 목록 (필터: restaurantId, userId)
export const getReviews = async (req: Request, res: Response) => {
  const { restaurantId, userId } = req.query;
  const where: any = {};
  if (restaurantId) where.restaurantId = restaurantId;
  if (userId) where.userId = userId;
  const reviews = await prisma.review.findMany({
    where,
    include: { user: true, restaurant: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(reviews);
};

// 리뷰 작성
export const createReview = async (req: Request, res: Response) => {
  const { restaurantId, rating, content } = req.body;
  const userId = (req.user as any).userId;
  const review = await prisma.review.create({
    data: { userId, restaurantId, rating, content },
  });
  res.status(201).json(review);
};

// 리뷰 수정
export const updateReview = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { rating, content } = req.body;
  const userId = (req.user as any).userId;
  const review = await prisma.review.findFirst({ where: { id, userId } });
  if (!review) return res.status(403).json({ message: '수정 권한이 없습니다.' });
  const updated = await prisma.review.update({ where: { id }, data: { rating, content } });
  res.json(updated);
};

// 리뷰 삭제
export const deleteReview = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req.user as any).userId;
  const review = await prisma.review.findFirst({ where: { id, userId } });
  if (!review) return res.status(403).json({ message: '삭제 권한이 없습니다.' });
  await prisma.review.delete({ where: { id } });
  res.json({ message: '리뷰가 삭제되었습니다.' });
};

// 특정 식당의 리뷰 목록
export const getReviewsByRestaurant = async (req: Request, res: Response) => {
  const { restaurantId } = req.params;
  const reviews = await prisma.review.findMany({
    where: { restaurantId },
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(reviews);
};

// 특정 유저의 리뷰 목록
export const getReviewsByUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const reviews = await prisma.review.findMany({
    where: { userId },
    include: { restaurant: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(reviews);
};

// 특정 식당의 리뷰 상세 조회
export const getReviewById = async (req: Request, res: Response) => {
  const { restaurantId, reviewId } = req.params;
  const review = await prisma.review.findFirst({
    where: { id: reviewId, restaurantId },
    include: { user: true, restaurant: true },
  });
  if (!review) return res.status(404).json({ message: '리뷰를 찾을 수 없습니다.' });
  res.json(review);
}; 