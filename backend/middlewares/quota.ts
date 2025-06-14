import { Request, Response, NextFunction } from 'express';

// 예시: 요금제별 쿼터 제한값
const quotaConfig: Record<string, { reservations: number; menus: number; apiCalls: number }> = {
  FREE: { reservations: 50, menus: 10, apiCalls: 10000 },
  BASIC: { reservations: 500, menus: 50, apiCalls: 100000 },
  PREMIUM: { reservations: 5000, menus: 500, apiCalls: 1000000 },
  ENTERPRISE: { reservations: Infinity, menus: Infinity, apiCalls: Infinity },
};

// 실제 사용량 체크는 DB/Redis 등에서 가져와야 함 (여기선 예시)
export const checkQuota = (type: 'reservations' | 'menus' | 'apiCalls') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as any;
    const plan = user?.tenant?.plan || 'FREE';
    // 실제 사용량은 DB에서 조회 필요 (여기선 0으로 가정)
    const used = 0;
    const limit = quotaConfig[plan][type];
    if (used >= limit) {
      return res.status(429).json({ message: `요금제(${plan}) 한도 초과: ${type}` });
    }
    next();
  };
}; 