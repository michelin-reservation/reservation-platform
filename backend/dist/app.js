"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Sentry = __importStar(require("@sentry/node"));
const integrations_1 = require("@sentry/integrations");
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const restaurantRoutes_1 = __importDefault(require("./routes/restaurantRoutes"));
const reservationRoutes_1 = __importDefault(require("./routes/reservationRoutes"));
const favoriteRoutes_1 = __importDefault(require("./routes/favoriteRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const vipRequestRoutes_1 = __importDefault(require("./routes/vipRequestRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const metrics_1 = __importDefault(require("./routes/metrics"));
const errorHandler_1 = require("./middlewares/errorHandler");
Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new integrations_1.RewriteFrames({ root: global.__dirname }),
    ],
    tracesSampleRate: 1.0,
});
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(Sentry.Handlers.requestHandler());
app.use('/api/auth', authRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/restaurants', restaurantRoutes_1.default);
app.use('/api/reservations', reservationRoutes_1.default);
app.use('/api/favorites', favoriteRoutes_1.default);
app.use('/api/payments', paymentRoutes_1.default);
app.use('/api/reviews', reviewRoutes_1.default);
app.use('/api/vip-requests', vipRequestRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/metrics', metrics_1.default);
app.use(Sentry.Handlers.errorHandler());
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map