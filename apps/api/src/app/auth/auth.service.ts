import { JwtTokenPayload } from '@auth/shared-types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EnvironmentVariables } from '../app.module';
import { UsersService } from '../users/users.service';
import { JwtRefreshTokenPayload } from './dtos/jwt-refresh-token-payload.dto';
import { JwtTokensWithUser } from './dtos/jwt-tokens-with-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService<EnvironmentVariables>
  ) {}

  async validateUser(
    email: string,
    password: string
  ): Promise<Express.User | undefined> {
    const user = await this.usersService.findOne({ email });

    if (user && user.password === password) {
      return {
        id: user.id,
        email: user.email,
        permissions: user.permissions,
        roles: user.roles,
      };
    }
  }

  async validateRefreshToken(
    userId: number,
    token: string
  ): Promise<Express.User | undefined> {
    const user = await this.usersService.findOne({ id: userId });

    if (user && user.refresh_tokens.includes(token)) {
      await this.usersService.removeRefreshToken(userId, token);

      return {
        id: user.id,
        email: user.email,
        permissions: user.permissions,
        roles: user.roles,
      };
    }
  }

  async getToken(user: Express.User): Promise<string> {
    const payload: JwtTokenPayload = {
      email: user.email,
      sub: user.id,
      roles: user.roles,
      permissions: user.permissions,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRATION'),
    });
  }

  async getRefreshToken(user: Express.User): Promise<string> {
    const payload: JwtRefreshTokenPayload = {
      sub: user.id,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION'),
    });
  }

  async login(user: Express.User): Promise<JwtTokensWithUser> {
    const accessToken = await this.getToken(user);
    const refreshToken = await this.getRefreshToken(user);

    await this.usersService.addRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }
}
