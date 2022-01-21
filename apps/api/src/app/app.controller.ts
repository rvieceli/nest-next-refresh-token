import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { JwtRefreshTokenAuthGuard } from './auth/guards/jwt-refresh-token-auth.guard';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService
  ) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @UseGuards(LocalAuthGuard)
  @Post('/sessions')
  async login(@Req() request: Request) {
    return this.authService.login(request.user);
  }

  @UseGuards(JwtRefreshTokenAuthGuard)
  @Post('/refresh')
  async refresh(@Req() request: Request) {
    return this.authService.login(request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async me(@Req() request: Request) {
    return request.user;
  }
}
