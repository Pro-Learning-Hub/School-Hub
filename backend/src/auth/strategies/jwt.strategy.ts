import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const secret = process.env.TOKEN_SECRET_KEY;
    if (!secret) {
      throw new InternalServerErrorException('TOKEN_SECRET_KEY environment variable is not set');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    if (!payload.userId) {
      throw new UnauthorizedException();
    }
    return { userId: payload.userId, courseId: payload.courseId, role: payload.role };
  }
}
