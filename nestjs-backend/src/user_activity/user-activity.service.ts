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

@Injectable()
export class UserActivitysService {
  constructor(
    @InjectModel(UserActivity.name)
    private UserActivityModel: SoftDeleteModel<UserActivityDocument>,
    private albumservice: AlbumsService,
    private trackService: TracksService,
    private artistService: ArtistsService,
  ) {}

  async CreateNewUserActivity(createUserActivityDto: CreateUserActivitysDto) {
    const alreadtExistsUser = this.UserActivityModel.findOne({
      user: createUserActivityDto.user.toString(),
    });

    if (alreadtExistsUser) {
      throw new HttpException('User is already exists!', HttpStatus.FOUND);
    }

    return await this.UserActivityModel.create(createUserActivityDto);
  }

  async create(user: string) {
    return await this.UserActivityModel.create({ user });
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
    const existingUser = await this.UserActivityModel.findOne({
      user: createUserActivityDto.user,
    });

    if (existingUser) {
      // 🛠 Kiểm tra xem track đã có trong danh sách chưa
      const trackExists = await this.UserActivityModel.findOne({
        user: createUserActivityDto.user,
        tracks: track, // Kiểm tra track đã tồn tại trong mảng `tracks`
      });

      if (!trackExists && quantity === 1) {
        // Nếu track chưa có và quantity = 1, thêm vào
        const result = await this.UserActivityModel.updateOne(
          { user: createUserActivityDto.user },
          { $push: { tracks: track }, updatedBy: user._id },
        );
        return result;
      } else if (trackExists && quantity === -1) {
        // Nếu track có và quantity = -1, Xóa !
        const result = await this.UserActivityModel.updateOne(
          { user: createUserActivityDto.user },
          { $pull: { tracks: track }, updatedBy: user._id },
        );
        return result;
      }
    } else {
      const result = await this.UserActivityModel.create({
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
    const existingUser = await this.UserActivityModel.findOne({
      user: user._id,
    });

    if (existingUser) {
      // 🛠 Kiểm tra xem artist đã có trong danh sách chưa
      const trackExists = await this.UserActivityModel.findOne({
        user: createUserActivityDto.user,
        artists: artist, // Kiểm tra artist đã tồn tại trong mảng `artists`
      });

      if (!trackExists && quantity === 1) {
        // Nếu artist chưa có và quantity = 1, thêm vào
        const result = await this.UserActivityModel.updateOne(
          { user: createUserActivityDto.user },
          { $push: { artists: artist }, updatedBy: user._id },
        );
      } else if (trackExists && quantity === -1) {
        // Nếu artist có và quantity = -1, Xóa !
        const result = await this.UserActivityModel.updateOne(
          { user: createUserActivityDto.user },
          { $pull: { artists: artist }, updatedBy: user._id },
        );
      }
    } else {
      const result = await this.UserActivityModel.create({
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
    const { quantity, albums } = createUserActivityDto;

    //Check artist existed or not
    await this.albumservice.findById(createUserActivityDto.albums.toString());

    //Update count UserActivity for artist
    await this.albumservice.updateCountLike(albums.toString(), quantity, user);

    //Check user existed or not in UserActivity schema
    const existingUser = await this.UserActivityModel.findOne({
      user: createUserActivityDto.user,
    });

    if (existingUser) {
      // 🛠 Kiểm tra xem artist đã có trong danh sách chưa
      const trackExists = await this.UserActivityModel.findOne({
        user: createUserActivityDto.user,
        albums: albums, // Kiểm tra artist đã tồn tại trong mảng `artists`
      });

      if (!trackExists && quantity === 1) {
        // Nếu artist chưa có và quantity = 1, thêm vào
        const result = await this.UserActivityModel.updateOne(
          { user: createUserActivityDto.user },
          { $push: { albums: albums }, updatedBy: user._id },
        );
        return result;
      } else if (trackExists && quantity === -1) {
        // Nếu artist có và quantity = -1, Xóa !
        const result = await this.UserActivityModel.updateOne(
          { user: createUserActivityDto.user },
          { $pull: { albums: albums }, updatedBy: user._id },
        );
        return result;
      }
    } else {
      const result = await this.UserActivityModel.create({
        albums: [albums],
        user: user._id,
      });
      return result;
    }
  }

  async findAll(current: number, pageSize: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+current - 1) * +pageSize;
    let defaultpageSize = +pageSize ? +pageSize : 10;

    const totalItems = (await this.UserActivityModel.find(filter)).length;
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

    const data = await this.UserActivityModel.find(filter)
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

    const totalItems = (await this.UserActivityModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultpageSize);

    const defaultPopulation = [
      {
        path: 'tracks',
      },
      {
        path: 'user',
      },
      {
        path: 'albums',
      },
    ];

    const data = await this.UserActivityModel.find({ user: user._id })
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

  async findById(id: string) {
    const result = await this.UserActivityModel.findOne({ user: id }).populate([
      {
        path: 'artists',
      },
      {
        path: 'user',
      },
      {
        path: 'albums',
      },
    ]);

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
    const result = await this.UserActivityModel.updateOne(
      { _id: id },
      {
        ...updateUserActivityDto,
        updatedBy: user._id,
      },
    );

    return result;
  }

  async remove(id: string, user: IUser) {
    await this.UserActivityModel.updateOne(
      { _id: id },
      {
        deletedBy: user._id,
      },
    );

    const remove = await this.UserActivityModel.softDelete({
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
