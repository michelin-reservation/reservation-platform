import { Prisma } from '@prisma/client';

export function softDeleteMiddleware(): Prisma.Middleware {
  return async (params, next) => {
    const softDeleteModels = ['User', 'Restaurant', 'Reservation', 'Review', 'Favorite', 'Payment', 'VipRequest'];

    // 자동 삭제 → deletedAt 업데이트로 변경
    if (params.action === 'delete' || params.action === 'deleteMany') {
      if (softDeleteModels.includes(params.model!)) {
        params.action = params.action === 'delete' ? 'update' : 'updateMany';
        params.args['data'] = { deletedAt: new Date() };
      }
    }

    // 쿼리에서 기본적으로 deletedAt=null만 조회
    if (params.action === 'findMany' || params.action === 'findUnique') {
      if (softDeleteModels.includes(params.model!)) {
        params.args.where = {
          ...params.args.where,
          deletedAt: null,
        };
      }
    }
    return next(params);
  };
} 