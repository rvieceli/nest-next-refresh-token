import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { REFRESH_TOKEN_STRATEGY } from '../strategies/jwt-refresh-token.strategy';

@Injectable()
export class JwtRefreshTokenAuthGuard extends AuthGuard(
  REFRESH_TOKEN_STRATEGY
) {}
