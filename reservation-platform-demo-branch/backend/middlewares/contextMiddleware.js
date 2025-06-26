/**
 * @file middlewares/contextMiddleware.js
 * @description 요청의 컨텍스트(경로, 사용자 유형 등)를 분석하고,
 *              비즈니스 규칙에 따라 접근을 제어하며, 후속 미들웨어에서
 *              활용할 수 있는 정보를 주입하는 미들웨어.
 */

// API 경로별 접근 정책 및 컨텍스트 정의
const routePolicies = {
    '/api/vip': { category: 'VIP', roles: ['VIP', '관리자'] },
    '/api/admin': { category: 'ADMIN', roles: ['관리자'] },
    '/api/business': { category: 'BUSINESS', roles: ['사업자', '관리자'] },
    '/api/reservation': { category: 'RESERVATION', roles: ['일반', 'VIP', '관리자'] },
    '/api/review': { category: 'REVIEW', roles: ['일반', 'VIP', '관리자'] },
    '/api/favorite': { category: 'FAVORITE', roles: ['일반', 'VIP', '관리자'] },
    '/api/payment': { category: 'PAYMENT', roles: ['일반', 'VIP', '관리자'] },
};

/**
 * 요청 컨텍스트를 분석하고 접근 권한을 확인하는 미들웨어
 */
function contextMiddleware(req, res, next) {
    const userType = req.user?.user_type || '일반';
    const path = req.path;
    const clientType = req.headers['x-client-type'] || 'unknown';

    let routeCategory = 'PUBLIC';
    let requiredRoles = [];

    // 1. 현재 요청 경로에 맞는 정책과 카테고리를 찾습니다.
    for (const prefix in routePolicies) {
        if (path.startsWith(prefix)) {
            const policy = routePolicies[prefix];
            routeCategory = policy.category;
            requiredRoles = policy.roles || [];
            break;
        }
    }

    // 2. 후속 미들웨어/로거에서 활용할 수 있도록 요청 객체에 컨텍스트 정보를 주입합니다.
    req.context = {
        userType,
        routeCategory,
        clientType,
        requestTimestamp: new Date(),
    };

    // 3. 콘솔에 컨텍스트 로그를 출력합니다.
    console.info(
        `[CONTEXT] [user_type:${userType}] [client:${clientType}] [route:${path}] [category:${routeCategory}]`
    );

    // 4. 정책에 따라 접근 권한을 확인합니다.
    if (requiredRoles.length > 0 && !requiredRoles.includes(userType)) {
        return res.status(403).json({
            message: `[${userType}] 역할은 [${routeCategory}] 기능에 접근할 권한이 없습니다.`,
            requiredRoles,
        });
    }

    // 5. 모든 검사를 통과하면 다음 미들웨어로 진행합니다.
    next();
}

module.exports = { contextMiddleware };