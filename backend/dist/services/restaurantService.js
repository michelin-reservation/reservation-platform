"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRestaurantById = exports.getAllRestaurants = void 0;
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const getAllRestaurants = () => prismaClient_1.default.restaurant.findMany();
exports.getAllRestaurants = getAllRestaurants;
const getRestaurantById = (id) => prismaClient_1.default.restaurant.findUnique({ where: { id } });
exports.getRestaurantById = getRestaurantById;
//# sourceMappingURL=restaurantService.js.map