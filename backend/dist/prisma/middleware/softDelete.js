"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.softDeleteMiddleware = softDeleteMiddleware;
function softDeleteMiddleware() {
    return async (params, next) => {
        const softDeleteModels = ['User', 'Restaurant', 'Reservation', 'Review', 'Favorite', 'Payment', 'VipRequest'];
        if (params.action === 'delete' || params.action === 'deleteMany') {
            if (softDeleteModels.includes(params.model)) {
                params.action = params.action === 'delete' ? 'update' : 'updateMany';
                params.args['data'] = { deletedAt: new Date() };
            }
        }
        if (params.action === 'findMany' || params.action === 'findUnique') {
            if (softDeleteModels.includes(params.model)) {
                params.args.where = {
                    ...params.args.where,
                    deletedAt: null,
                };
            }
        }
        return next(params);
    };
}
//# sourceMappingURL=softDelete.js.map