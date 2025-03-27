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
import { TrackPlay, TrackPlayDocument } from './schemas/track-play.schema';
import { CreateTrackPlaysDto } from './dto/create-track-play.dto';
import { UpdateTrackPlaysDto } from './dto/update-track-play.dto';
import mongoose from 'mongoose';

@Injectable()
export class TrackPlaysService {
  constructor(
    @InjectModel(TrackPlay.name)
    private trackPlayModel: SoftDeleteModel<TrackPlayDocument>,
  ) {}

  async recordPlay(trackId: string, userId: string) {
    await this.trackPlayModel.create({
      track: trackId,
      user: new mongoose.Types.ObjectId(userId),
    });
  }

  async getMonthlyRecord(dateLimit: Date) {
    const listeners = await this.trackPlayModel.aggregate([
      { $match: { createdAt: { $gte: dateLimit } } }, // Chỉ lấy dữ liệu trong 28 ngày
      {
        $lookup: {
          from: 'trackartists', // Bảng TrackArtist
          localField: 'track',
          foreignField: 'track',
          as: 'trackArtistData',
        },
      },
      { $unwind: '$trackArtistData' }, // Giải nén danh sách track-artist
      {
        $group: {
          _id: { artist: '$trackArtistData.artist', user: '$user' }, // Gom theo user + artist
        },
      },
      {
        $group: {
          _id: '$_id.artist',
          count: { $sum: 1 }, // Đếm số user nghe từng nghệ sĩ
        },
      },
    ]);

    return listeners;
  }
}
