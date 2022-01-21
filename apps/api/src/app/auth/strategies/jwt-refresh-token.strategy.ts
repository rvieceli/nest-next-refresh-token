import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvironmentVariables } from '../../app.module';
import { AuthService } from '../auth.service';
import { JwtRefreshTokenPayload } from '../dtos/jwt-refresh-token-payload.dto';

export const REFRESH_TOKEN_STRATEGY = 'refresh-token';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  REFRESH_TOKEN_STRATEGY
) {
  constructor(
    private authService: AuthService,
    configService: ConfigService<EnvironmentVariables>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(
    request: Request<unknown, unknown, { refreshToken: string }>,
    payload: JwtRefreshTokenPayload
  ) {
    const userId = payload.sub;
    const { refreshToken } = request.body;

    const user = await this.authService.validateRefreshToken(
      userId,
      refreshToken
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
