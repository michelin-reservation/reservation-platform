"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNotificationSettings = exports.getNotificationSettings = exports.updateUserProfile = exports.getUserByEmail = exports.createUser = exports.getUserById = void 0;
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const getUserById = (id) => prismaClient_1.default.user.findUnique({ where: { id } });
exports.getUserById = getUserById;
const createUser = (data) => prismaClient_1.default.user.create({ data });
exports.createUser = createUser;
const getUserByEmail = async (email) => {
    return null;
};
exports.getUserByEmail = getUserByEmail;
const updateUserProfile = async (user_id, { name, email, currentPassword, newPassword }) => {
    return null;
};
exports.updateUserProfile = updateUserProfile;
const getNotificationSettings = async (user_id) => {
    return null;
};
exports.getNotificationSettings = getNotificationSettings;
const updateNotificationSettings = async (user_id, data) => {
    return null;
};
exports.updateNotificationSettings = updateNotificationSettings;
//# sourceMappingURL=userService.js.map