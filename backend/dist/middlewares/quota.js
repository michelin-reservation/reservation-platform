"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkQuota = void 0;
const quotaConfig = {
    FREE: { reservations: 50, menus: 10, apiCalls: 10000 },
    BASIC: { reservations: 500, menus: 50, apiCalls: 100000 },
    PREMIUM: { reservations: 5000, menus: 500, apiCalls: 1000000 },
    ENTERPRISE: { reservations: Infinity, menus: Infinity, apiCalls: Infinity },
};
const checkQuota = (type) => {
    return async (req, res, next) => {
        var _a;
        const user = req.user;
        const plan = ((_a = user === null || user === void 0 ? void 0 : user.tenant) === null || _a === void 0 ? void 0 : _a.plan) || 'FREE';
        const used = 0;
        const limit = quotaConfig[plan][type];
        if (used >= limit) {
            return res.status(429).json({ message: `요금제(${plan}) 한도 초과: ${type}` });
        }
        next();
    };
};
exports.checkQuota = checkQuota;
//# sourceMappingURL=quota.js.map