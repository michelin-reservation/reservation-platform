"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllVipRequests = exports.getAllReservations = exports.rejectRestaurant = exports.approveRestaurant = exports.getAllRestaurants = exports.getAllUsers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllUsers = getAllUsers;
const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await prisma.restaurant.findMany();
        res.json(restaurants);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllRestaurants = getAllRestaurants;
const approveRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurant = await prisma.restaurant.update({
            where: { id },
            data: { status: 'APPROVED' }
        });
        res.json(restaurant);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.approveRestaurant = approveRestaurant;
const rejectRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurant = await prisma.restaurant.update({
            where: { id },
            data: { status: 'REJECTED' }
        });
        res.json(restaurant);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.rejectRestaurant = rejectRestaurant;
const getAllReservations = async (req, res) => {
    const reservations = await prisma.reservation.findMany({
        include: { user: true, restaurant: true }
    });
    res.json(reservations);
};
exports.getAllReservations = getAllReservations;
const getAllVipRequests = async (req, res) => {
    const vipRequests = await prisma.vipRequest.findMany({
        include: { user: true }
    });
    res.json(vipRequests);
};
exports.getAllVipRequests = getAllVipRequests;
//# sourceMappingURL=adminController.js.map