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
import { FolderUser, FolderUserDocument } from './schemas/folder-user.schema';
import { CreateFolderUsersDto } from './dto/create-folder-user.dto';
import { UpdateFolderUsersDto } from './dto/update-folder-user.dto';
import mongoose from 'mongoose';

@Injectable()
export class FolderUsersService {
  constructor(
    @InjectModel(FolderUser.name)
    private FolderUserModel: SoftDeleteModel<FolderUserDocument>,
  ) {}

  hashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);

    return hash;
  };

  async create(createFolderUserDto: CreateFolderUsersDto) {
    // Kiểm tra xem email đã tồn tại chưa
    const existingFolderUser = await this.FolderUserModel.findOne({
      name: createFolderUserDto.name,
    });
    // Nếu email đã tồn tại thì trả ra lỗi
    if (existingFolderUser) {
      throw new HttpException(
        'FolderUser already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.FolderUserModel.create({
      ...createFolderUserDto,
    });

    if (!result) {
      throw new HttpException(
        'Create new FolderUser failed',
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

    const totalItems = (await this.FolderUserModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultpageSize);

    const data = await this.FolderUserModel.find(filter)
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
    const result = await this.FolderUserModel.findById(id);

    if (!result) {
      throw new HttpException('FolderUser not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async findOneByName(name: string) {
    const result = await this.FolderUserModel.findOne({ name });

    if (!result) {
      throw new HttpException('FolderUser not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async update(
    id: string,
    updateFolderUserDto: UpdateFolderUsersDto,
    user: IUser,
  ) {
    const result = await this.FolderUserModel.updateOne(
      { _id: id },
      {
        ...updateFolderUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    return result;
  }

  async remove(id: string, user) {
    if (!mongoose.Types.ObjectId.isValid(id)) return `not found FolderUser`;

    const foundUser = await this.FolderUserModel.findById(id);

    if (foundUser.name === 'ADMIN') {
      throw new BadRequestException('Cannot delete FolderUser ADMIN');
    }

    await this.FolderUserModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    const result = await this.FolderUserModel.softDelete({
      _id: id,
    });

    if (result.deleted < 1) {
      throw new HttpException('FolderUser not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }
}
