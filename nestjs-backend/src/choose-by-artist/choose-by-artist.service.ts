import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { genSaltSync, hashSync } from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import {
  ChooseByArtist,
  ChooseByArtistDocument,
} from './schemas/choose-by-artist.schema';
import { CreateChooseByArtistsDto } from './dto/create-choose-by-artist.dto';
import { UpdateChooseByArtistsDto } from './dto/update-choose-by-artist.dto';
import { IUser } from '@/users/users.interface';

import aqp from 'api-query-params';

const defaultPopulation = [
  {
    path: 'artist',
  },
  {
    path: 'chooseTrack',
  },
  {
    path: 'createdBy',
  },
  {
    path: 'updatedBy',
  },
  {
    path: 'deletedBy',
  },
];

@Injectable()
export class ChooseByArtistsService {
  constructor(
    @InjectModel(ChooseByArtist.name)
    private ChooseByArtistModel: SoftDeleteModel<ChooseByArtistDocument>,
  ) {}

  hashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);

    return hash;
  };

  async create(data: CreateChooseByArtistsDto | string, user: IUser) {
    if (typeof data === 'string') {
      const result = await this.ChooseByArtistModel.create({
        artist: data,
        createdBy: {
          _id: user._id,
          email: user.email,
        },
      });
      if (!result) {
        throw new HttpException(
          'Create new ChooseByArtist failed',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return result;
      // Xử lý khi chỉ có artistId
    } else {
      // Xử lý khi nhận DTO đầy đủ
      const result = await this.ChooseByArtistModel.create({
        ...data,
        createdBy: {
          _id: user._id,
          email: user.email,
        },
      });
      if (!result) {
        throw new HttpException(
          'Create new ChooseByArtist failed',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return result;
    }
  }

  async findAll(current: number, pageSize: number, qs: string) {
    const { filter, sort } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+current - 1) * +pageSize;
    let defaultpageSize = +pageSize ? +pageSize : 10;

    const totalItems = (await this.ChooseByArtistModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultpageSize);

    const data = await this.ChooseByArtistModel.find(filter)
      .skip(offset)
      .limit(defaultpageSize)
      .sort(sort as any)
      .populate(defaultPopulation)
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
    const result = (
      await this.ChooseByArtistModel.findOne({ artist: id })
    ).populate(defaultPopulation);

    if (!result) {
      throw new HttpException('ChooseByArtist not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async update(
    id: string,
    updateChooseByArtistDto: UpdateChooseByArtistsDto,
    user: IUser,
  ) {
    const result = await this.ChooseByArtistModel.updateOne(
      { _id: id },
      {
        ...updateChooseByArtistDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    return result;
  }

  async remove(id: string, user) {
    await this.ChooseByArtistModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    const result = await this.ChooseByArtistModel.softDelete({
      _id: id,
    });

    if (result.deleted < 1) {
      throw new HttpException('ChooseByArtist not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }
}
