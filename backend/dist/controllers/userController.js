"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFavorites = exports.getUserReviews = exports.getUserReservations = exports.updateUser = exports.getCurrentUser = exports.updateNotificationSettings = exports.getNotificationSettings = exports.updateProfile = exports.getProfile = exports.login = exports.signup = exports.createUser = exports.getUser = void 0;
const userService = __importStar(require("../services/userService"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getUser = async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    if (!user)
        return res.status(404).json({ message: 'User not found' });
    res.json(user);
};
exports.getUser = getUser;
const createUser = async (req, res) => {
    const user = await userService.createUser(req.body);
    res.json(user);
};
exports.createUser = createUser;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const signup = async (req, res) => {
    try {
        const { email, password, userName, userType, phone, companyName } = req.body;
        const existingUser = await userService.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = await userService.createUser({
            email,
            password: hashedPassword,
            userName,
            userType,
            phone,
            companyName
        });
        const token = jsonwebtoken_1.default.sign({ id: newUser.id, userType: newUser.userType }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({
            success: true,
            message: '회원가입이 완료되었습니다.',
            token,
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                userType: newUser.userType
            }
        });
    }
    catch (error) {
        console.error('회원가입 에러:', error);
        res.status(500).json({
            success: false,
            message: error.message || '회원가입 중 오류가 발생했습니다.'
        });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userService.getUserByEmail(email);
        if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
            return res.status(401).json({
                success: false,
                message: '이메일 또는 비밀번호가 올바르지 않습니다.'
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                userName: user.userName,
                userType: user.userType
            }
        });
    }
    catch (error) {
        console.error('로그인 에러:', error);
        res.status(500).json({
            success: false,
            message: error.message || '로그인 중 오류가 발생했습니다.'
        });
    }
};
exports.login = login;
const getProfile = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.user.user_id);
        if (!user)
            return res.status(404).json({ code: 'NOT_FOUND', message: '사용자를 찾을 수 없습니다.' });
        res.json({ code: 'SUCCESS', data: user });
    }
    catch (err) {
        next(err);
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res, next) => {
    try {
        const user = await userService.updateUserProfile(req.user.user_id, req.body);
        res.json({ code: 'SUCCESS', data: user });
    }
    catch (err) {
        next(err);
    }
};
exports.updateProfile = updateProfile;
const getNotificationSettings = async (req, res, next) => {
    try {
        const settings = await userService.getNotificationSettings(req.user.user_id);
        res.json(settings);
    }
    catch (err) {
        next(err);
    }
};
exports.getNotificationSettings = getNotificationSettings;
const updateNotificationSettings = async (req, res, next) => {
    try {
        const settings = await userService.updateNotificationSettings(req.user.user_id, req.body);
        res.json({ message: '알림 설정이 업데이트되었습니다.', settings });
    }
    catch (err) {
        next(err);
    }
};
exports.updateNotificationSettings = updateNotificationSettings;
const getCurrentUser = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId }
        });
        if (!user) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getCurrentUser = getCurrentUser;
const updateUser = async (req, res) => {
    try {
        const user = await prisma.user.update({
            where: { id: req.user.userId },
            data: req.body
        });
        res.json(user);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateUser = updateUser;
const getUserReservations = async (req, res) => {
    try {
        const reservations = await prisma.reservation.findMany({
            where: { userId: req.user.userId }
        });
        res.json(reservations);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getUserReservations = getUserReservations;
const getUserReviews = async (req, res) => {
    try {
        const reviews = await prisma.review.findMany({
            where: { userId: req.user.userId }
        });
        res.json(reviews);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getUserReviews = getUserReviews;
const getUserFavorites = async (req, res) => {
    try {
        const favorites = await prisma.favorite.findMany({
            where: { userId: req.user.userId }
        });
        res.json(favorites);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getUserFavorites = getUserFavorites;
//# sourceMappingURL=userController.js.map