"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const softDelete_1 = require("../prisma/middleware/softDelete");
const auditLog_1 = require("../prisma/middleware/auditLog");
const prisma = new client_1.PrismaClient();
prisma.$use((0, softDelete_1.softDeleteMiddleware)());
prisma.$use((0, auditLog_1.auditLogMiddleware)(prisma));
exports.default = prisma;
//# sourceMappingURL=prismaClient.js.map