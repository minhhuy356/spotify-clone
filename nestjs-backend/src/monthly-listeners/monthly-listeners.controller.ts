import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';

import { Public, ResponseMessage, User } from '@/decorator/customize';
import { IUser } from '@/users/users.interface';
import { MonthlyListenersService } from './monthly-listeners.service';
import { UpdateMonthlyListenersDto } from './dto/update-monthly-listener.dto';
import { CreateMonthlyListenersDto } from './dto/create-monthly-listener.dto';
import { Cron } from '@nestjs/schedule';

@Controller('monthly-listeners')
export class MonthlyListenersController {
  constructor(
    private readonly monthlyListenerService: MonthlyListenersService,
  ) {}

  @Public()
  @Get(':artistId')
  async getMonthlyListeners(@Param('artistId') artistId: string) {
    return this.monthlyListenerService.findOne(artistId);
  }

  @Cron('0 0 * * *') // Chạy mỗi phút một lần
  @Public()
  @Get('')
  async handleCron() {
    await this.monthlyListenerService.calculateMonthlyListeners();
  }
}
