import {
  Controller,
  Get,
  Post,
  Render,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Public } from './decorator/customize';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async handleLogin(@Request() req) {
    return await req.user;
  }

  @Get('profile')
  async getProfile(@Request() req) {
    return await req.user;
  }
  @Public()
  @Get()
  @Render('index')
  getHello() {
    const message = 'Yêu Trân <3';
    return { message: message };
  }
}
