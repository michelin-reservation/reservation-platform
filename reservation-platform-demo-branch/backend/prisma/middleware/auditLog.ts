import { PrismaClient } from '@prisma/client';

export function auditLogMiddleware(prisma: PrismaClient) {
  return async (params: any, next: any) => {
    const result = await next(params);
    const auditableModels = ['User', 'Restaurant', 'Reservation', 'Payment', 'Review'];
    if (auditableModels.includes(params.model)) {
      await prisma.auditLog.create({
        data: {
          model: params.model,
          operation: params.action,
          recordId: params.args?.where?.id ?? 'unknown',
          dataAfter: result,
          timestamp: new Date(),
        },
      });
    }
    return result;
  };
} 