import { JwtTokenPayload } from '@auth/shared-types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvironmentVariables } from '../../app.module';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    configService: ConfigService<EnvironmentVariables>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(
    payload: JwtTokenPayload
  ): Promise<Omit<User, 'password' | 'refresh_tokens'>> {
    const { sub: id, email } = payload;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, refresh_tokens, ...user } =
      await this.usersService.findOne({
        id,
        email,
      });

    return user;
  }
}
