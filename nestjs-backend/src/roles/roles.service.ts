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
import { Role, RoleDocument } from './schemas/role.schemas';
import { CreateRolesDto } from './dto/create-role.dto';
import { UpdateRolesDto } from './dto/update-role.dto';
import mongoose from 'mongoose';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>,
  ) {}

  hashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);

    return hash;
  };

  async create(createRoleDto: CreateRolesDto) {
    // Kiểm tra xem email đã tồn tại chưa
    const existingRole = await this.roleModel.findOne({
      name: createRoleDto.name,
    });
    // Nếu email đã tồn tại thì trả ra lỗi
    if (existingRole) {
      throw new HttpException('Role already exists', HttpStatus.BAD_REQUEST);
    }

    const result = await this.roleModel.create({
      ...createRoleDto,
    });

    if (!result) {
      throw new HttpException(
        'Create new Role failed',
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

    const totalItems = (await this.roleModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultpageSize);

    const data = await this.roleModel
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
    const result = await this.roleModel.findById(id);

    if (!result) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async findOneByName(name: string) {
    const result = await this.roleModel.findOne({ name });

    if (!result) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async update(id: string, updateRoleDto: UpdateRolesDto, user: IUser) {
    const result = await this.roleModel.updateOne(
      { _id: id },
      {
        ...updateRoleDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    return result;
  }

  async remove(id: string, user) {
    if (!mongoose.Types.ObjectId.isValid(id)) return `not found role`;

    const foundUser = await this.roleModel.findById(id);

    if (foundUser.name === 'ADMIN') {
      throw new BadRequestException('Cannot delete role ADMIN');
    }

    await this.roleModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    const result = await this.roleModel.softDelete({
      _id: id,
    });

    if (result.deleted < 1) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }
}
