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

import mongoose from 'mongoose';
import { UserActivitysService } from '@/user_activity/user-activity.service';
import {
  UserPlaylist,
  UserPlaylistDocument,
} from './schemas/user-playlist.schema';
import { CreateUserPlaylistsDto } from './dto/create-user-playlist.dto';
import { UpdateUserPlaylistsDto } from './dto/update-user-playlist.dto';

@Injectable()
export class UserPlaylistsService {
  constructor(
    @InjectModel(UserPlaylist.name)
    private userPlaylistModel: SoftDeleteModel<UserPlaylistDocument>,
    private userActivitysService: UserActivitysService,
  ) {}

  hashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);

    return hash;
  };

  async create(createUserPlaylistDto: CreateUserPlaylistsDto, user: IUser) {
    const result = await this.userPlaylistModel.create({
      ...createUserPlaylistDto,
    });

    if (!result) {
      throw new HttpException(
        'Create new UserPlaylist failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      await this.userActivitysService.UpdatePlaylist(
        result._id.toString(),
        user._id.toString(),
        1,
      );
    } catch (error) {
      throw new error();
    }

    const resAddLibrary = await this.userPlaylistModel.updateOne(
      { _id: result._id.toString() },
      { addLibraryAt: new Date() },
    );
    if (resAddLibrary) {
      const info = this.userPlaylistModel.findOne({ _id: result._id });

      return info;
    }
  }

  async findAll(current: number, pageSize: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+current - 1) * +pageSize;
    let defaultpageSize = +pageSize ? +pageSize : 10;

    const totalItems = (await this.userPlaylistModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultpageSize);

    const data = await this.userPlaylistModel
      .find(filter)
      .skip(offset)
      .limit(defaultpageSize)
      .sort(sort as any)
      .populate(population)
      .select(projection)
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
    const result = await this.userPlaylistModel.findById(id);

    if (!result) {
      throw new HttpException('UserPlaylist not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async findOneByName(name: string) {
    const result = await this.userPlaylistModel.findOne({ name });

    if (!result) {
      throw new HttpException('UserPlaylist not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async update(
    id: string,
    updateUserPlaylistDto: UpdateUserPlaylistsDto,
    user: IUser,
  ) {
    if (updateUserPlaylistDto.order) {
      throw new HttpException(
        'Nếu sắp xếp thì phải có folder !',
        HttpStatus.BAD_REQUEST, // hoặc HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    if (updateUserPlaylistDto.folder) {
      throw new HttpException(
        'Nếu có thư mục phải có thứ tự sắp xếp (order) !',
        HttpStatus.BAD_REQUEST, // hoặc HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    const result = await this.userPlaylistModel.updateOne(
      { _id: id },
      {
        ...updateUserPlaylistDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    if (result) return await this.userPlaylistModel.findById(id);
  }

  async remove(id: string, user: IUser) {
    await this.userPlaylistModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    const result = await this.userPlaylistModel.deleteOne({
      _id: id,
    });

    if (result.deletedCount < 1) {
      throw new HttpException(
        'Danh sách phát không tồn tại!',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.userActivitysService.UpdatePlaylist(id, user._id.toString(), -1);

    return result;
  }
}
