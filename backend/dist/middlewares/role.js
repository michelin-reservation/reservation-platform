"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBusiness = exports.isAdmin = void 0;
const client_1 = require("@prisma/client");
const isAdmin = (req, res, next) => {
    if (req.user.userType !== client_1.UserType.ADMIN) {
        return res.status(403).json({ message: '관리자만 접근할 수 있습니다.' });
    }
    next();
};
exports.isAdmin = isAdmin;
const isBusiness = (req, res, next) => {
    if (req.user.userType !== client_1.UserType.BUSINESS) {
        return res.status(403).json({ message: '사업자만 접근할 수 있습니다.' });
    }
    next();
};
exports.isBusiness = isBusiness;
//# sourceMappingURL=role.js.map