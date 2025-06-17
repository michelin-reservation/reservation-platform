import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export const cache = (duration: number) => {
    return async (req: Request, res: Response, next: NextFunction) => {
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
            res.json = function (body: any) {
                redis.setex(key, duration, JSON.stringify(body));
                return originalJson.call(this, body);
            };
            next();
        } catch (error) {
            console.error('Cache middleware error:', error);
            next();
        }
    };
};
