import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { genSaltSync, hashSync } from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

import { IUser } from '@/users/users.interface';

import aqp from 'api-query-params';
import { CreateArtistTypeGroupsDto } from './dto/create-artist-type.dto';
import {
  ArtistTypeGroup,
  ArtistTypeGroupDocument,
} from './schemas/artist-type.schema';
import { UpdateArtistTypeGroupsDto } from './dto/update-artist-type.dto';

@Injectable()
export class ArtistTypeGroupsService {
  constructor(
    @InjectModel(ArtistTypeGroup.name)
    private ArtistTypeGroupModel: SoftDeleteModel<ArtistTypeGroupDocument>,
  ) {}

  hashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);

    return hash;
  };

  async create(
    createArtistTypeGroupDto: CreateArtistTypeGroupsDto,
    user: IUser,
  ) {
    // Kiểm tra xem email đã tồn tại chưa
    const existingArtistTypeGroup = await this.ArtistTypeGroupModel.findOne({
      name: createArtistTypeGroupDto.name,
    });
    // Nếu email đã tồn tại thì trả ra lỗi
    if (existingArtistTypeGroup) {
      throw new HttpException(
        'ArtistTypeGroup already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.ArtistTypeGroupModel.create({
      ...createArtistTypeGroupDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    if (!result) {
      throw new HttpException(
        'Create new ArtistTypeGroup failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }

  async findAll(current: number, pageSize: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+current - 1) * +pageSize;
    let defaultpageSize = +pageSize ? +pageSize : 10;

    const totalItems = (await this.ArtistTypeGroupModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultpageSize);

    const data = await this.ArtistTypeGroupModel.find(filter)
      .skip(offset)
      .limit(defaultpageSize)
      .sort(sort as any)
      .populate(population)
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
    const ArtistTypeGroup = await this.ArtistTypeGroupModel.findById(id);

    if (!ArtistTypeGroup) {
      throw new HttpException(
        'ArtistTypeGroup not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      result: ArtistTypeGroup,
    };
  }

  async update(
    id: string,
    updateArtistTypeGroupDto: UpdateArtistTypeGroupsDto,
    user: IUser,
  ) {
    const result = await this.ArtistTypeGroupModel.updateOne(
      { _id: id },
      {
        ...updateArtistTypeGroupDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    return result;
  }

  async remove(id: string, user) {
    await this.ArtistTypeGroupModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    const remove = await this.ArtistTypeGroupModel.softDelete({
      _id: id,
    });

    if (remove.deleted < 1) {
      throw new HttpException(
        'ArtistTypeGroup not found',
        HttpStatus.NOT_FOUND,
      );
    }

    const result = {
      statusCode: HttpStatus.OK,
      message: 'Delete ArtistTypeGroup by id',
      data: {
        result: remove,
      },
    };

    return result;
  }

  async updateCountPopularity(id: string, quantity: number, user: IUser) {
    await this.ArtistTypeGroupModel.findById(id);

    const result = await this.ArtistTypeGroupModel.updateOne(
      { _id: id },
      {
        $inc: { countLike: quantity }, // Gán giá trị mới
        updatedBy: user._id,
      },
    );

    return { result };
  }
}
