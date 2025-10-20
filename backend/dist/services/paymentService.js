"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentsByUser = exports.createPayment = void 0;
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const createPayment = (data) => prismaClient_1.default.payment.create({ data });
exports.createPayment = createPayment;
const getPaymentsByUser = (userId) => prismaClient_1.default.payment.findMany({ where: { userId } });
exports.getPaymentsByUser = getPaymentsByUser;
//# sourceMappingURL=paymentService.js.map