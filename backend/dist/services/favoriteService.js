"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFavorite = exports.getFavoritesByUser = exports.addFavorite = void 0;
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const addFavorite = (data) => prismaClient_1.default.favorite.create({ data });
exports.addFavorite = addFavorite;
const getFavoritesByUser = (userId) => prismaClient_1.default.favorite.findMany({ where: { userId }, include: { restaurant: true } });
exports.getFavoritesByUser = getFavoritesByUser;
const deleteFavorite = (id) => prismaClient_1.default.favorite.delete({ where: { id } });
exports.deleteFavorite = deleteFavorite;
//# sourceMappingURL=favoriteService.js.map