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
import { TrackPlaysService } from '@/track-plays/track-plays.service';
import { TracksService } from '@/tracks/tracks.service';

@Injectable()
export class MonthlyListenersService {
  constructor(
    @InjectModel(MonthlyListener.name)
    private monthlyListenersModel: SoftDeleteModel<MonthlyListenerDocument>,
    private trackPlaysService: TrackPlaysService,
  ) {}

  async calculateMonthlyListeners() {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - 28); // Lấy mốc thời gian 28 ngày trước

    const listeners = await this.trackPlaysService.getMonthlyRecord(dateLimit);
    console.log('listeners', listeners);
    // Lưu vào bảng MonthlyListeners
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
