import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.TOKEN_SECRET_KEY || 'secret',
    });
  }

  async validate(payload: any) {
    if (!payload.userId) {
      throw new UnauthorizedException();
    }
    return { userId: payload.userId, courseId: payload.courseId, role: payload.role };
  }
}
