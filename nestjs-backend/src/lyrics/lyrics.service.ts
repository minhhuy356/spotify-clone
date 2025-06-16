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
import { Lyric, LyricDocument } from './schemas/Lyric.schema';
import { CreateLyricsDto } from './dto/create-Lyric.dto';
import { UpdateLyricsDto } from './dto/update-Lyric.dto';
import mongoose from 'mongoose';
import { TracksService } from '@/tracks/tracks.service';
const defaultPopulation = [
  {
    path: 'track',
  },
];

@Injectable()
export class LyricsService {
  constructor(
    @InjectModel(Lyric.name)
    private LyricModel: SoftDeleteModel<LyricDocument>,
    private trackService: TracksService,
  ) {}

  hashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);

    return hash;
  };

  async create(createLyricDto: CreateLyricsDto) {
    await this.trackService.findById(createLyricDto.track.toString());

    const result = await this.LyricModel.create({
      ...createLyricDto,
    });

    if (!result) {
      throw new HttpException(
        'Create new Lyric failed',
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

    const totalItems = (await this.LyricModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultpageSize);

    const data = await this.LyricModel.find(filter)
      .skip(offset)
      .limit(defaultpageSize)
      .sort(sort as any)
      .populate(defaultPopulation)
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
    const result = (await this.LyricModel.findById(id)).populate(
      defaultPopulation,
    );

    if (!result) {
      throw new HttpException('Lyric not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async update(id: string, updateLyricDto: UpdateLyricsDto, user: IUser) {
    const result = await this.LyricModel.updateOne(
      { _id: id },
      {
        ...updateLyricDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    return result;
  }

  async remove(id: string, user: IUser) {
    await this.LyricModel.updateOne(
      { _id: id },
      {
        deletedBy: user._id,
      },
    );

    const remove = await this.LyricModel.softDelete({
      _id: id,
    });

    if (remove.deleted < 1) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }

    return {
      result: this.LyricModel.findById(id),
    };
  }
}
