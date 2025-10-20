"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReviewsByRestaurant = exports.addReview = void 0;
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const addReview = (data) => prismaClient_1.default.review.create({ data });
exports.addReview = addReview;
const getReviewsByRestaurant = (restaurantId) => prismaClient_1.default.review.findMany({ where: { restaurantId }, include: { user: true } });
exports.getReviewsByRestaurant = getReviewsByRestaurant;
//# sourceMappingURL=reviewService.js.map