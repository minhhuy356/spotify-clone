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
import { CreateUserTypesDto } from './dto/create-user-type.dto';
import { UserType, UserTypeDocument } from './schemas/user-type.schema';
import { UpdateUserTypesDto } from './dto/update-user-type.dto';

@Injectable()
export class UserTypesService {
  constructor(
    @InjectModel(UserType.name)
    private UserTypeModel: SoftDeleteModel<UserTypeDocument>,
  ) {}

  hashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);

    return hash;
  };

  async create(createUserTypeDto: CreateUserTypesDto) {
    // Kiểm tra xem email đã tồn tại chưa
    const existingUserType = await this.UserTypeModel.findOne({
      name: createUserTypeDto.name,
    });
    // Nếu email đã tồn tại thì trả ra lỗi
    if (existingUserType) {
      throw new HttpException(
        'UserType already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.UserTypeModel.create({
      ...createUserTypeDto,
    });

    if (!result) {
      throw new HttpException(
        'Create new UserType failed',
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

    const totalItems = (await this.UserTypeModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultpageSize);

    const data = await this.UserTypeModel.find(filter)
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
    const result = await this.UserTypeModel.findById(id);

    if (!result) {
      throw new HttpException('UserType not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async findOneByName(name: string) {
    const result = await this.UserTypeModel.findOne({ name });

    if (!result) {
      throw new HttpException('UserType not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async update(id: string, updateUserTypeDto: UpdateUserTypesDto, user: IUser) {
    const result = await this.UserTypeModel.updateOne(
      { _id: id },
      {
        ...updateUserTypeDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    return result;
  }

  async remove(id: string, user) {
    if (!mongoose.Types.ObjectId.isValid(id)) return `not found UserType`;

    const foundUser = await this.UserTypeModel.findById(id);

    if (foundUser.name === 'ADMIN') {
      throw new BadRequestException('Cannot delete UserType ADMIN');
    }

    await this.UserTypeModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    const result = await this.UserTypeModel.softDelete({
      _id: id,
    });

    if (result.deleted < 1) {
      throw new HttpException('UserType not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }
}
