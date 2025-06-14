import { PrismaClient } from '@prisma/client';
import { softDeleteMiddleware } from '../prisma/middleware/softDelete';
import { auditLogMiddleware } from '../prisma/middleware/auditLog';

const prisma = new PrismaClient();

prisma.$use(softDeleteMiddleware());
prisma.$use(auditLogMiddleware(prisma));

export default prisma; 