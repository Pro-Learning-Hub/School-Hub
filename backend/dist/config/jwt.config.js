"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConfig = void 0;
const jwtConfig = () => {
    const secret = process.env.TOKEN_SECRET_KEY;
    if (!secret)
        throw new Error('TOKEN_SECRET_KEY environment variable is not set');
    return {
        secret,
        signOptions: { expiresIn: '7d' },
    };
};
exports.jwtConfig = jwtConfig;
//# sourceMappingURL=jwt.config.js.map