"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllReviews = exports.getReviewById = exports.getReviewsByUser = exports.getReviewsByRestaurant = exports.deleteReview = exports.updateReview = exports.createReview = exports.getReviews = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getReviews = async (req, res) => {
    const { restaurantId, userId } = req.query;
    const where = {};
    if (restaurantId)
        where.restaurantId = restaurantId;
    if (userId)
        where.userId = userId;
    const reviews = await prisma.review.findMany({
        where,
        include: { user: true, restaurant: true },
        orderBy: { createdAt: 'desc' },
    });
    res.json(reviews);
};
exports.getReviews = getReviews;
const createReview = async (req, res) => {
    try {
        const { restaurantId, rating, content } = req.body;
        const userId = req.user.userId;
        const review = await prisma.review.create({
            data: { userId, restaurantId, rating, content },
        });
        res.status(201).json(review);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createReview = createReview;
const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, content } = req.body;
        const userId = req.user.userId;
        const review = await prisma.review.findFirst({ where: { id, userId } });
        if (!review)
            return res.status(403).json({ message: '수정 권한이 없습니다.' });
        const updated = await prisma.review.update({ where: { id }, data: { rating, content } });
        res.json(updated);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateReview = updateReview;
const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const review = await prisma.review.findFirst({ where: { id, userId } });
        if (!review)
            return res.status(403).json({ message: '삭제 권한이 없습니다.' });
        await prisma.review.delete({ where: { id } });
        res.status(204).send();
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.deleteReview = deleteReview;
const getReviewsByRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const reviews = await prisma.review.findMany({
            where: { restaurantId },
            include: { user: true },
            orderBy: { createdAt: 'desc' },
        });
        res.json(reviews);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getReviewsByRestaurant = getReviewsByRestaurant;
const getReviewsByUser = async (req, res) => {
    const { userId } = req.params;
    const reviews = await prisma.review.findMany({
        where: { userId },
        include: { restaurant: true },
        orderBy: { createdAt: 'desc' },
    });
    res.json(reviews);
};
exports.getReviewsByUser = getReviewsByUser;
const getReviewById = async (req, res) => {
    try {
        const { restaurantId, reviewId } = req.params;
        const review = await prisma.review.findFirst({
            where: { id: reviewId, restaurantId },
            include: { user: true, restaurant: true },
        });
        if (!review)
            return res.status(404).json({ message: '리뷰를 찾을 수 없습니다.' });
        res.json(review);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getReviewById = getReviewById;
const getAllReviews = async (req, res) => {
    try {
        const reviews = await prisma.review.findMany({
            include: {
                user: true,
                restaurant: true
            }
        });
        res.json(reviews);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllReviews = getAllReviews;
//# sourceMappingURL=reviewController.js.map