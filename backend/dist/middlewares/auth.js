"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBusiness = exports.isAdmin = exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const authenticate = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: '인증 토큰이 없습니다.' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwt.secret);
        req.user = {
            userId: decoded.userId,
            userType: decoded.userType,
            user_id: decoded.user_id
        };
        next();
    }
    catch (error) {
        return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    }
};
exports.authenticate = authenticate;
const authorize = (roles) => {
    return (req, res, next) => {
        var _a;
        const userType = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userType;
        if (!roles.includes(userType)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
};
exports.authorize = authorize;
const isAdmin = (req, res, next) => {
    var _a;
    const userType = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userType;
    if (userType !== 'ADMIN') {
        return res.status(403).json({ message: '관리자만 접근할 수 있습니다.' });
    }
    next();
};
exports.isAdmin = isAdmin;
const isBusiness = (req, res, next) => {
    const user = req.user;
    if ((user === null || user === void 0 ? void 0 : user.userType) !== 'BUSINESS') {
        return res.status(403).json({ message: '사업자만 접근할 수 있습니다.' });
    }
    next();
};
exports.isBusiness = isBusiness;
//# sourceMappingURL=auth.js.map