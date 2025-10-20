"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLogMiddleware = auditLogMiddleware;
function auditLogMiddleware(prisma) {
    return async (params, next) => {
        var _a, _b, _c;
        const result = await next(params);
        const auditableModels = ['User', 'Restaurant', 'Reservation', 'Payment', 'Review'];
        if (auditableModels.includes(params.model)) {
            await prisma.auditLog.create({
                data: {
                    model: params.model,
                    operation: params.action,
                    recordId: (_c = (_b = (_a = params.args) === null || _a === void 0 ? void 0 : _a.where) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : 'unknown',
                    dataAfter: result,
                    timestamp: new Date(),
                },
            });
        }
        return result;
    };
}
//# sourceMappingURL=auditLog.js.map