import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { genSaltSync, hashSync } from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Artist, ArtistDocument } from './schemas/artist.schema';
import { CreateArtistsDto } from './dto/create-artists.dto';
import { UpdateArtistsDto } from './dto/update-artists.dto';
import { IUser } from '@/users/users.interface';

import aqp from 'api-query-params';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectModel(Artist.name)
    private artistModel: SoftDeleteModel<ArtistDocument>,
  ) {}

  hashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);

    return hash;
  };

  async create(createArtistDto: CreateArtistsDto, user: IUser) {
    // Kiểm tra xem email đã tồn tại chưa
    const existingArtist = await this.artistModel.findOne({
      stageName: createArtistDto.stageName,
    });
    // Nếu email đã tồn tại thì trả ra lỗi
    if (existingArtist) {
      throw new HttpException('Artist already exists', HttpStatus.BAD_REQUEST);
    }

    const result = await this.artistModel.create({
      ...createArtistDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    if (!result) {
      throw new HttpException(
        'Create new Artist failed',
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

    const totalItems = (await this.artistModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultpageSize);

    const data = await this.artistModel
      .find(filter)
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
    const result = await this.artistModel.findById(id);

    if (!result) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async update(id: string, updateArtistDto: UpdateArtistsDto, user: IUser) {
    const result = await this.artistModel.updateOne(
      { _id: id },
      {
        ...updateArtistDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    return result;
  }

  async remove(id: string, user) {
    await this.artistModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    const result = await this.artistModel.softDelete({
      _id: id,
    });

    if (result.deleted < 1) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async updateCountLike(id: string, quantity: number, user: IUser) {
    const artist = await this.artistModel.findById(id);

    if (!artist) throw new Error('Artist not found');

    const newCountLike = Math.max(0, (artist.countLike || 0) + quantity); // Đảm bảo không âm

    const result = await this.artistModel.updateOne(
      { _id: id },
      {
        $set: { countLike: newCountLike }, // Gán giá trị mới
        updatedBy: user._id,
      },
    );

    return result;
  }
}
