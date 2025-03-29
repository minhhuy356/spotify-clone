import {
  BadGatewayException,
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
  UserActivity,
  UserActivityDocument,
} from './schemas/user-activity.schemas';
import { CreateUserActivitysDto } from './dto/create-user-activity.dto';
import { UpdateUserActivitysDto } from './dto/update-user-activity.dto';

import { TracksService } from '@/tracks/tracks.service';
import { ArtistsService } from '@/artists/artists.service';
import { AlbumsService } from '@/albums/Albums.service';
import path from 'path';
import { UserActivitysModule } from './user-activity.module';
const populate = [
  {
    path: 'artists',
  },
  {
    path: 'user',
  },
  {
    path: 'albums',
    populate: {
      path: 'releasedBy', // Trường cụ thể trong albums cần populate
    },
  },
  {
    path: 'tracks',
  },
];

@Injectable()
export class UserActivitysService {
  constructor(
    @InjectModel(UserActivity.name)
    private userActivityModel: SoftDeleteModel<UserActivityDocument>,
    private albumservice: AlbumsService,
    private trackService: TracksService,
    private artistService: ArtistsService,
  ) {}

  async CreateNewUserActivity(createUserActivityDto: CreateUserActivitysDto) {
    const alreadtExistsUser = this.userActivityModel.findOne({
      user: createUserActivityDto.user.toString(),
    });

    if (alreadtExistsUser) {
      throw new HttpException('User is already exists!', HttpStatus.FOUND);
    }

    return await this.userActivityModel.create(createUserActivityDto);
  }

  async create(user: string) {
    return await this.userActivityModel.create({ user });
  }

  async SubscribeTrack(
    createUserActivityDto: CreateUserActivitysDto,
    user: IUser,
  ) {
    const { quantity, track } = createUserActivityDto;

    //Check track existed or not
    await this.trackService.findById(createUserActivityDto.track.toString());

    //Update count UserActivity for track
    await this.trackService.increaseLike(track.toString(), quantity, user);

    //Check user existed or not in UserActivity schema
    const existingUser = await this.userActivityModel.findOne({
      user: user._id,
    });

    if (existingUser) {
      // 🛠 Kiểm tra xem track đã có trong danh sách chưa
      const trackExists = await this.userActivityModel.findOne({
        user: user._id,
        tracks: track, // Kiểm tra track đã tồn tại trong mảng `tracks`
      });

      if (!trackExists && quantity === 1) {
        // Nếu track chưa có và quantity = 1, thêm vào
        const result = await this.userActivityModel.updateOne(
          { user: user._id },
          { $push: { tracks: track }, updatedBy: user._id, user: user._id },
        );
        console.log(1);
        return result;
      } else if (trackExists && quantity === -1) {
        // Nếu track có và quantity = -1, Xóa !
        const result = await this.userActivityModel.updateOne(
          { user: user._id },
          { $pull: { tracks: track }, updatedBy: user._id, user: user._id },
        );
        console.log(-1);
        return result;
      }
    } else {
      const result = await this.userActivityModel.create({
        tracks: [track],
        user: user._id,
      });
      return result;
    }
  }

  async SubscribeArtist(
    createUserActivityDto: CreateUserActivitysDto,
    user: IUser,
  ) {
    const { quantity, artist } = createUserActivityDto;

    //Check artist existed or not
    await this.artistService.findById(createUserActivityDto.artist.toString());

    //Update count UserActivity for artist
    await this.artistService.updateCountLike(artist.toString(), quantity, user);

    //Check user existed or not in UserActivity schema
    const existingUser = await this.userActivityModel.findOne({
      user: user._id,
    });

    if (existingUser) {
      // 🛠 Kiểm tra xem artist đã có trong danh sách chưa
      const trackExists = await this.userActivityModel.findOne({
        user: user._id,
        artists: artist, // Kiểm tra artist đã tồn tại trong mảng `artists`
      });

      if (!trackExists && quantity === 1) {
        // Nếu artist chưa có và quantity = 1, thêm vào
        const result = await this.userActivityModel.updateOne(
          { user: user._id },
          { $push: { artists: artist }, updatedBy: user._id },
        );
      } else if (trackExists && quantity === -1) {
        // Nếu artist có và quantity = -1, Xóa !
        const result = await this.userActivityModel.updateOne(
          { user: user._id },
          { $pull: { artists: artist }, updatedBy: user._id },
        );
      }
    } else {
      const result = await this.userActivityModel.create({
        artists: [artist],
        user: user._id,
      });
    }
    return await this.findById(user._id);
  }

  async SubscribeAlbum(
    createUserActivityDto: CreateUserActivitysDto,
    user: IUser,
  ) {
    const { quantity, album } = createUserActivityDto;

    //Check artist existed or not
    await this.albumservice.findById(createUserActivityDto.album.toString());

    //Update count UserActivity for artist
    await this.albumservice.updateCountLike(album.toString(), quantity, user);

    //Check user existed or not in UserActivity schema
    const existingUser = await this.userActivityModel.findOne({
      user: user._id,
    });

    if (existingUser) {
      const trackExists = await this.userActivityModel.findOne({
        user: user._id,
        albums: album,
      });

      if (!trackExists && quantity === 1) {
        const result = await this.userActivityModel.updateOne(
          { user: user._id },
          { $push: { albums: album }, updatedBy: user._id },
        );
        return result;
      } else if (trackExists && quantity === -1) {
        const result = await this.userActivityModel.updateOne(
          { user: user._id },
          { $pull: { albums: album }, updatedBy: user._id },
        );
        return result;
      }
    } else {
      const result = await this.userActivityModel.create({
        albums: [album],
        user: user._id,
      });
      return result;
    }
  }

  async UpdateFolder(folderId: string, userId: string, quantity: number) {
    if (quantity === 1) {
      return await this.userActivityModel.updateOne(
        { user: userId },
        { $push: { folders: folderId }, updatedBy: userId },
      );
    } else {
      return await this.userActivityModel.updateOne(
        { user: userId },
        { $pull: { folders: folderId }, updatedBy: userId },
      );
    }
  }

  async UpdatePlaylist(playlistId: string, userId: string, quantity: number) {
    if (quantity === 1) {
      return await this.userActivityModel.updateOne(
        { user: userId },
        { $push: { playlists: playlistId }, updatedBy: userId },
      );
    } else {
      return await this.userActivityModel.updateOne(
        { user: userId },
        { $pull: { playlists: playlistId }, updatedBy: userId },
      );
    }
  }

  async findAll(current: number, pageSize: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+current - 1) * +pageSize;
    let defaultpageSize = +pageSize ? +pageSize : 10;

    const totalItems = (await this.userActivityModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultpageSize);

    const defaultPopulation = [
      {
        path: 'tracks',
        select: '_id name imgUrl trackUrl',
      },
      {
        path: 'user',
        select: '_id name email',
      },
    ];

    const data = await this.userActivityModel
      .find(filter)
      .skip(offset)
      .limit(defaultpageSize)
      .sort(sort as any)
      .populate(defaultPopulation)
      .select(projection as any)
      .exec();

    return {
      meta: {
        current: current, //trang hiện tại
        pageSize: pageSize, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result: data, //kết quả query
    };
  }

  async getTrackSubscribedByUser(
    user: IUser,
    current: number,
    pageSize: number,
    qs: string,
  ) {
    const { filter, sort, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+current - 1) * +pageSize;
    let defaultpageSize = +pageSize ? +pageSize : 10;

    const totalItems = (await this.userActivityModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultpageSize);

    const data = await this.userActivityModel
      .find({ user: user._id })
      .skip(offset)
      .limit(defaultpageSize)
      .sort(sort as any)
      .populate(populate)
      .select(projection as any)
      .exec();

    return {
      meta: {
        current: current, //trang hiện tại
        pageSize: pageSize, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result: data, //kết quả query
    };
  }

  async findById(id: string) {
    const result = await this.userActivityModel
      .findOne({
        user: id,
      })
      .populate(populate);

    if (!result) {
      throw new HttpException('UserActivity not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async update(
    id: string,
    updateUserActivityDto: UpdateUserActivitysDto,
    user: IUser,
  ) {
    const result = await this.userActivityModel.updateOne(
      { _id: id },
      {
        ...updateUserActivityDto,
        updatedBy: user._id,
      },
    );

    return result;
  }

  async remove(id: string, user: IUser) {
    await this.userActivityModel.updateOne(
      { _id: id },
      {
        deletedBy: user._id,
      },
    );

    const remove = await this.userActivityModel.softDelete({
      _id: id,
    });

    if (remove.deleted < 1) {
      throw new HttpException('UserActivity not found', HttpStatus.NOT_FOUND);
    }

    const result = {
      statusCode: HttpStatus.OK,
      message: 'Delete UserActivity by id',
      data: {
        result: remove,
      },
    };

    return result;
  }
}
