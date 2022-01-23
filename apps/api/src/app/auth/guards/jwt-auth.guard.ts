import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context, status?) {
    if (info?.name === 'TokenExpiredError') {
      throw new UnauthorizedException('TOKEN_EXPIRED');
    }

    return super.handleRequest(err, user, info, context, status);
  }
}
