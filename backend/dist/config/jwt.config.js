"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConfig = void 0;
const jwtConfig = () => ({
    secret: process.env.TOKEN_SECRET_KEY || 'secret',
    signOptions: { expiresIn: '7d' },
});
exports.jwtConfig = jwtConfig;
//# sourceMappingURL=jwt.config.js.map