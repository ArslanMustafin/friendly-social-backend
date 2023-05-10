import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { PayloadJwtType } from '../types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: PayloadJwtType, done: VerifiedCallback) {
    // Получаем токен из хедера запроса
    const token = req.headers['authorization'].split(' ')[1];

    if (!token) {
      return done(new UnauthorizedException('Токен не найден'), false);
    }

    const user = await this.authService.validateUser(payload);

    if (!user) {
      return done(new UnauthorizedException('Неверный токен'), false);
    }

    if (user.token !== token) {
      return done(new UnauthorizedException('Токен пользователя не совпадает'), false);
    }

    return done(null, user, payload.iat);
  }
}
