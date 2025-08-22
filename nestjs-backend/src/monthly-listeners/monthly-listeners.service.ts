import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { genSaltSync, hashSync } from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

import { IUser } from '@/users/users.interface';

import aqp from 'api-query-params';
import {
  MonthlyListener,
  MonthlyListenerDocument,
} from './schemas/monthly-listener.schema';
import { CreateMonthlyListenersDto } from './dto/create-monthly-listener.dto';
import { UpdateMonthlyListenersDto } from './dto/update-monthly-listener.dto';
import mongoose, { ObjectId } from 'mongoose';
import { ListeningHistorysService } from '@/listening-history/listening-historys.service';
import { TracksService } from '@/tracks/tracks.service';

@Injectable()
export class MonthlyListenersService {
  constructor(
    @InjectModel(MonthlyListener.name)
    private monthlyListenersModel: SoftDeleteModel<MonthlyListenerDocument>,
    private ListeningHistorysService: ListeningHistorysService,
  ) {}

  async calculateMonthlyListeners() {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - 28);

    const listeners =
      await this.ListeningHistorysService.getMonthlyRecord(dateLimit);

    for (const listener of listeners) {
      const data = await this.monthlyListenersModel.findOneAndUpdate(
        { artist: listener._id },
        { listenersCount: listener.count, updatedAt: new Date() },
        { upsert: true, new: true },
      );
    }
  }

  async findOne(artistId: string) {
    const data = await this.monthlyListenersModel.findOne({ artist: artistId });

    return { artistId, count: data?.listenersCount || 0 };
  }
}
