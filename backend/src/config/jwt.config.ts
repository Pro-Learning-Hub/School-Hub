import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig = (): JwtModuleOptions => ({
  secret: process.env.TOKEN_SECRET_KEY || 'secret',
  signOptions: { expiresIn: '7d' },
});
