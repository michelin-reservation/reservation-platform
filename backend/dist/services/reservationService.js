"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReservationsByUser = exports.createReservation = void 0;
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const createReservation = (data) => prismaClient_1.default.reservation.create({ data });
exports.createReservation = createReservation;
const getReservationsByUser = (userId) => prismaClient_1.default.reservation.findMany({ where: { userId } });
exports.getReservationsByUser = getReservationsByUser;
//# sourceMappingURL=reservationService.js.map