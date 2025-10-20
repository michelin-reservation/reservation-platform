"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const redis = new ioredis_1.default(process.env.REDIS_URL || 'redis://localhost:6379');
const cache = (duration) => {
    return async (req, res, next) => {
        if (req.method !== 'GET') {
            return next();
        }
        const key = `cache:${req.originalUrl}`;
        try {
            const cachedResponse = await redis.get(key);
            if (cachedResponse) {
                return res.json(JSON.parse(cachedResponse));
            }
            const originalJson = res.json;
            res.json = function (body) {
                redis.setex(key, duration, JSON.stringify(body));
                return originalJson.call(this, body);
            };
            next();
        }
        catch (error) {
            console.error('Cache middleware error:', error);
            next();
        }
    };
};
exports.cache = cache;
//# sourceMappingURL=cache.js.map