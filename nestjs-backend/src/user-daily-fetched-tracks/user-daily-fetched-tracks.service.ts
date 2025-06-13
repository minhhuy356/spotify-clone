import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { genSaltSync, hashSync } from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

import { IUser, TOrder } from '@/users/users.interface';

import aqp from 'api-query-params';

import mongoose, { Types } from 'mongoose';
import { UserActivitysService } from '@/user_activity/user-activity.service';
import { CreateUserDailyFetchedTracksDto } from './dto/create-user-daily-fetched-track.dto';
import {
  UserDailyFetchedTrack,
  UserDailyFetchedTrackDocument,
} from './schemas/user-daily-fetched-track.schema';
import { UpdateUserDailyFetchedTracksDto } from './dto/update-user-daily-fetched-track.dto';
import { TracksService } from '@/tracks/tracks.service';
import { TrackArtistsService } from '@/track-artist/track-artist.service';

const defaultPopulate = [
  {
    path: 'track',
  },
];

@Injectable()
export class UserDailyFetchedTracksService {
  constructor(
    @InjectModel(UserDailyFetchedTrack.name)
    private UserDailyFetchedTrackModel: SoftDeleteModel<UserDailyFetchedTrackDocument>,
    private userActivitysService: UserActivitysService,
    private trackArtistSerivce: TrackArtistsService,
  ) {}

  hashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);

    return hash;
  };

  async create(
    createUserDailyFetchedTrackDto: CreateUserDailyFetchedTracksDto,
    user: IUser,
  ) {
    const result = await this.UserDailyFetchedTrackModel.create({
      ...createUserDailyFetchedTrackDto,
      user: user._id,
    });

    if (!result) {
      throw new HttpException(
        'Create new UserDailyFetchedTrack failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (result) {
      const info = this.UserDailyFetchedTrackModel.findOne({ _id: result._id });

      return info;
    }
  }

  // async findAll(current: number, pageSize: number, qs: string) {
  //   const { filter, sort, population, projection } = aqp(qs);
  //   delete filter.current;
  //   delete filter.pageSize;

  //   let offset = (+current - 1) * +pageSize;
  //   let defaultpageSize = +pageSize ? +pageSize : 10;

  //   const totalItems = (await this.UserDailyFetchedTrackModel.find(filter))
  //     .length;
  //   const totalPages = Math.ceil(totalItems / defaultpageSize);

  //   const data = await this.UserDailyFetchedTrackModel.find(filter)
  //     .skip(offset)
  //     .limit(defaultpageSize)
  //     .sort(sort as any)
  //     .populate(population)
  //     .select(projection)
  //     .exec();

  //   return {
  //     meta: {
  //       current: current, //trang hiện tại
  //       pageSize: pageSize, //số lượng bản ghi đã lấy
  //       pages: totalPages, //tổng số trang với điều kiện query
  //       total: totalItems, // tổng số phần tử (số bản ghi)
  //     },
  //     result: data, //kết quả query
  //   };
  // }
  async findAllTracksOfTheDayByUser(
    body: {
      artistsId: string[];
      genresId: string[];
      sortBy?: string;
      order?: TOrder;
      limit?: number;
    },
    user: IUser,
  ) {
    const {
      artistsId,
      genresId,
      sortBy = 'countPlay',
      order = 'desc',
      limit = 10,
    } = body;

    const limitNumber = Number(limit) || 10;
    const halfLimit = Math.ceil(limitNumber / 2);

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const track = await this.UserDailyFetchedTrackModel.aggregate([
      {
        $match: {
          user: new Types.ObjectId(user._id),
          createdAt: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        },
      },
    ]);

    const tracksId = track.map((item) => item.track);

    const allTrack = await this.trackArtistSerivce.fetchTrackByInfor(
      {
        artistsId,
        genresId,
        tracksId,
        sortBy,
        order,
        limit,
      },
      user,
    );

    if (allTrack?.length) {
      for (const item of allTrack) {
        this.create({ track: item._id }, user);
      }
    }
    return allTrack;
  }

  async findById(id: string) {
    const result = await this.UserDailyFetchedTrackModel.findById(id);

    if (!result) {
      throw new HttpException(
        'UserDailyFetchedTrack not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return result;
  }

  async remove(id: string, user) {
    await this.UserDailyFetchedTrackModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    const result = await this.UserDailyFetchedTrackModel.deleteOne({
      _id: id,
    });

    if (result.deletedCount < 1) {
      throw new HttpException(
        'UserDailyFetchedTrack not found',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.userActivitysService.UpdateFolder(id, user._id.toString(), -1);

    return result;
  }
}
