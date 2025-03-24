import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { genSaltSync, hashSync } from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

import { IUser } from '@/users/users.interface';

import aqp from 'api-query-params';
import {
  ArtistTypeDetail,
  ArtistTypeDetailDocument,
} from './schemas/artist-type-detail.schema';
import { CreateArtistTypeDetailsDto } from './dto/create-artist-type-detail.dto';
import { UpdateArtistTypeDetailsDto } from './dto/update-artist-type-detail.dto';

@Injectable()
export class ArtistTypeDetailsService {
  constructor(
    @InjectModel(ArtistTypeDetail.name)
    private ArtistTypeDetailModel: SoftDeleteModel<ArtistTypeDetailDocument>,
  ) {}

  hashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);

    return hash;
  };

  async create(
    createArtistTypeDetailDto: CreateArtistTypeDetailsDto,
    user: IUser,
  ) {
    // Kiểm tra xem email đã tồn tại chưa
    const existingArtistTypeDetail = await this.ArtistTypeDetailModel.findOne({
      name: createArtistTypeDetailDto.name,
    });
    // Nếu email đã tồn tại thì trả ra lỗi
    if (existingArtistTypeDetail) {
      throw new HttpException(
        'ArtistTypeDetail already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.ArtistTypeDetailModel.create({
      ...createArtistTypeDetailDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    if (!result) {
      throw new HttpException(
        'Create new ArtistTypeDetail failed',
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

    const totalItems = (await this.ArtistTypeDetailModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultpageSize);

    const data = await this.ArtistTypeDetailModel.find(filter)
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
    const ArtistTypeDetail = await this.ArtistTypeDetailModel.findById(id);

    if (!ArtistTypeDetail) {
      throw new HttpException(
        'ArtistTypeDetail not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      result: ArtistTypeDetail,
    };
  }

  async update(
    id: string,
    updateArtistTypeDetailDto: UpdateArtistTypeDetailsDto,
    user: IUser,
  ) {
    const result = await this.ArtistTypeDetailModel.updateOne(
      { _id: id },
      {
        ...updateArtistTypeDetailDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    return result;
  }

  async remove(id: string, user) {
    await this.ArtistTypeDetailModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    const remove = await this.ArtistTypeDetailModel.softDelete({
      _id: id,
    });

    if (remove.deleted < 1) {
      throw new HttpException(
        'ArtistTypeDetail not found',
        HttpStatus.NOT_FOUND,
      );
    }

    const result = {
      statusCode: HttpStatus.OK,
      message: 'Delete ArtistTypeDetail by id',
      data: {
        result: remove,
      },
    };

    return result;
  }

  async updateCountPopularity(id: string, quantity: number, user: IUser) {
    await this.ArtistTypeDetailModel.findById(id);

    const result = await this.ArtistTypeDetailModel.updateOne(
      { _id: id },
      {
        $inc: { countLike: quantity }, // Gán giá trị mới
        updatedBy: user._id,
      },
    );

    return { result };
  }
}
