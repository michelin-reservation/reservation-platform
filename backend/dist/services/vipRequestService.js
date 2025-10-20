"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVipRequestsByUser = exports.requestVip = void 0;
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const requestVip = (data) => prismaClient_1.default.vipRequest.create({ data });
exports.requestVip = requestVip;
const getVipRequestsByUser = (userId) => prismaClient_1.default.vipRequest.findMany({ where: { userId } });
exports.getVipRequestsByUser = getVipRequestsByUser;
//# sourceMappingURL=vipRequestService.js.map