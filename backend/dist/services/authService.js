"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.loginUser = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const prisma = new client_1.PrismaClient();
const createUser = async (data) => {
    const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
    return prisma.user.create({
        data: {
            email: data.email,
            password: hashedPassword,
            name: data.name,
            userType: data.userType || client_1.UserType.USER,
            tenant: {
                connect: {
                    id: data.tenantId || process.env.DEFAULT_TENANT_ID
                }
            }
        }
    });
};
exports.createUser = createUser;
const loginUser = async (email, password) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
        throw new Error('Invalid credentials');
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id, userType: user.userType }, config_1.config.jwt.secret, { expiresIn: config_1.config.jwt.expiresIn });
    return { token, user };
};
exports.loginUser = loginUser;
const verifyToken = (token) => jsonwebtoken_1.default.verify(token, config_1.config.jwt.secret);
exports.verifyToken = verifyToken;
//# sourceMappingURL=authService.js.map