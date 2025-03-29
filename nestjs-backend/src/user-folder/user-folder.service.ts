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
import { UserFolder, UserFolderDocument } from './schemas/user-folder.schema';
import { CreateUserFoldersDto } from './dto/create-user-folder.dto';
import { UpdateUserFoldersDto } from './dto/update-user-folder.dto';
import mongoose from 'mongoose';
import { UserActivitysService } from '@/user_activity/user-activity.service';

@Injectable()
export class UserFoldersService {
  constructor(
    @InjectModel(UserFolder.name)
    private UserFolderModel: SoftDeleteModel<UserFolderDocument>,
    private userActivitysService: UserActivitysService,
  ) {}

  hashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);

    return hash;
  };

  async create(createUserFolderDto: CreateUserFoldersDto, user: IUser) {
    const result = await this.UserFolderModel.create({
      ...createUserFolderDto,
    });

    if (!result) {
      throw new HttpException(
        'Create new UserFolder failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    await this.userActivitysService.UpdateFolder(
      result._id.toString(),
      user._id.toString(),
      1,
    );

    return result;
  }

  async findAll(current: number, pageSize: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+current - 1) * +pageSize;
    let defaultpageSize = +pageSize ? +pageSize : 10;

    const totalItems = (await this.UserFolderModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultpageSize);

    const data = await this.UserFolderModel.find(filter)
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
    const result = await this.UserFolderModel.findById(id);

    if (!result) {
      throw new HttpException('UserFolder not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async findOneByName(name: string) {
    const result = await this.UserFolderModel.findOne({ name });

    if (!result) {
      throw new HttpException('UserFolder not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async update(
    id: string,
    updateUserFolderDto: UpdateUserFoldersDto,
    user: IUser,
  ) {
    const result = await this.UserFolderModel.updateOne(
      { _id: id },
      {
        ...updateUserFolderDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    return result;
  }

  async remove(id: string, user) {
    await this.UserFolderModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    const result = await this.UserFolderModel.deleteOne({
      _id: id,
    });

    if (result.deletedCount < 1) {
      throw new HttpException('UserFolder not found', HttpStatus.NOT_FOUND);
    }

    await this.userActivitysService.UpdateFolder(id, user._id.toString(), -1);

    return result;
  }
}
