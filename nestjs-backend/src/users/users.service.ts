import {
  BadRequestException,
  Body,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IRole, IUser } from './users.interface';
import aqp from 'api-query-params';
import { emit } from 'process';
import { RoleDocument } from '@/roles/schemas/role.schemas';
import { RolesService } from '@/roles/Roles.service';

import { UserActivitysService } from '@/user_activity/user-activity.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
    private roleService: RolesService,

    private userActivityService: UserActivitysService,
  ) {}

  hashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);

    return hash;
  };

  async create(createUserDto: CreateUserDto, user?: IUser) {
    createUserDto.password = this.hashPassword(createUserDto.password);

    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    // Nếu email đã tồn tại thì trả ra lỗi
    if (existingUser) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }

    const role: any = await this.roleService.findOneByName('USER');

    const result = await this.userModel.create({
      ...createUserDto,
      roles: [role._id],

      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    if (!result) {
      throw new HttpException(
        'Create new User failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return { result: result };
  }
  async register(createUserDto: CreateUserDto) {
    createUserDto.password = this.hashPassword(createUserDto.password);

    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    // Nếu email đã tồn tại thì trả ra lỗi
    if (existingUser) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }

    const role: any = await this.roleService.findOneByName('USER');

    const result = await this.userModel.create({
      ...createUserDto,
      roles: [role._id],
    });

    if (!result) {
      throw new HttpException(
        'Create new User failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    await this.userActivityService.create(result._id.toString());

    return result;
  }

  async findAll(current: number, pageSize: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+current - 1) * +pageSize;
    let defaultpageSize = +pageSize ? +pageSize : 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultpageSize);

    const data = await this.userModel
      .find(filter)
      .skip(offset)
      .limit(defaultpageSize)
      .sort(sort as any)
      .populate(population as any)
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
    const user = await this.userModel.findById(id).populate([
      {
        path: 'roles',
        select: '_id name',
      },
      {
        path: 'accountType',
        select: '_id name',
      },
    ]);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return { result: user };
  }

  async findByUserName(username: string) {
    const user = await this.userModel.findOne({ email: username }).populate({
      path: 'roles',
      select: '_id name',
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(id: string, updateUserDto: UpdateUserDto, user: IUser) {
    return await this.userModel.updateOne(
      { _id: id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async verifyEmailById(id: string) {
    return await this.userModel.updateOne(
      { _id: id },
      {
        isVerify: true,
      },
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return `not found user`;

    const foundUser = await this.userModel.findById(id);

    if (foundUser.email === 'admin@gmail.com') {
      throw new BadRequestException('Cannot delete admin');
    }

    await this.userModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.userModel.softDelete({
      _id: id,
    });
  }

  updateUserToken = async (refresh_token: string, id: string) => {
    console.log(refresh_token, id);
    return await this.userModel.updateOne(
      { _id: id },
      { refresh_token: refresh_token },
    );
  };

  findUserByToken = async (refresh_token: string) => {
    return await this.userModel.findOne({ refresh_token }).populate({
      path: 'roles',
      select: '_id name',
    });
  };
}
