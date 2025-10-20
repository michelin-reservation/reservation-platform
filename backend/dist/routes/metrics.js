"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prom_client_1 = __importDefault(require("prom-client"));
const router = express_1.default.Router();
const collectDefaultMetrics = prom_client_1.default.collectDefaultMetrics;
collectDefaultMetrics();
router.get('/', async (req, res) => {
    res.set('Content-Type', prom_client_1.default.register.contentType);
    res.send(await prom_client_1.default.register.metrics());
});
exports.default = router;
//# sourceMappingURL=metrics.js.map