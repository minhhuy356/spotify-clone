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
  PlaylistUser,
  PlaylistUserDocument,
} from './schemas/playlist-user.schema';
import { CreatePlaylistUsersDto } from './dto/create-playlist-user.dto';
import { UpdatePlaylistUsersDto } from './dto/update-playlist-user.dto';
import mongoose from 'mongoose';

@Injectable()
export class PlaylistUsersService {
  constructor(
    @InjectModel(PlaylistUser.name)
    private PlaylistUserModel: SoftDeleteModel<PlaylistUserDocument>,
  ) {}

  hashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);

    return hash;
  };

  async create(createPlaylistUserDto: CreatePlaylistUsersDto) {
    // Kiểm tra xem email đã tồn tại chưa
    const existingPlaylistUser = await this.PlaylistUserModel.findOne({
      name: createPlaylistUserDto.name,
    });
    // Nếu email đã tồn tại thì trả ra lỗi
    if (existingPlaylistUser) {
      throw new HttpException(
        'PlaylistUser already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.PlaylistUserModel.create({
      ...createPlaylistUserDto,
    });

    if (!result) {
      throw new HttpException(
        'Create new PlaylistUser failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }

  async findAll(current: number, pageSize: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+current - 1) * +pageSize;
    let defaultpageSize = +pageSize ? +pageSize : 10;

    const totalItems = (await this.PlaylistUserModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultpageSize);

    const data = await this.PlaylistUserModel.find(filter)
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
    const result = await this.PlaylistUserModel.findById(id);

    if (!result) {
      throw new HttpException('PlaylistUser not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async findOneByName(name: string) {
    const result = await this.PlaylistUserModel.findOne({ name });

    if (!result) {
      throw new HttpException('PlaylistUser not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async update(
    id: string,
    updatePlaylistUserDto: UpdatePlaylistUsersDto,
    user: IUser,
  ) {
    const result = await this.PlaylistUserModel.updateOne(
      { _id: id },
      {
        ...updatePlaylistUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    return result;
  }

  async remove(id: string, user) {
    if (!mongoose.Types.ObjectId.isValid(id)) return `not found PlaylistUser`;

    const foundUser = await this.PlaylistUserModel.findById(id);

    if (foundUser.name === 'ADMIN') {
      throw new BadRequestException('Cannot delete PlaylistUser ADMIN');
    }

    await this.PlaylistUserModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    const result = await this.PlaylistUserModel.softDelete({
      _id: id,
    });

    if (result.deleted < 1) {
      throw new HttpException('PlaylistUser not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }
}
