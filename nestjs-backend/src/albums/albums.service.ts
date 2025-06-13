import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { genSaltSync, hashSync } from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Album, AlbumDocument } from './schemas/Album.schema';

import { IUser } from '@/users/users.interface';

import aqp from 'api-query-params';
import { CreateAlbumsDto } from './dto/create-album.dto';
import { UpdateAlbumsDto } from './dto/update-album.dto';

const defaultPopulation = [
  {
    path: 'releasedBy',
  },
];

@Injectable()
export class AlbumsService {
  constructor(
    @InjectModel(Album.name)
    private albumModel: SoftDeleteModel<AlbumDocument>,
  ) {}

  hashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);

    return hash;
  };

  async create(createAlbumDto: CreateAlbumsDto, user: IUser) {
    // Kiểm tra xem email đã tồn tại chưa
    const existingAlbum = await this.albumModel.findOne({
      name: createAlbumDto.name,
    });
    // Nếu email đã tồn tại thì trả ra lỗi
    if (existingAlbum) {
      throw new HttpException('Album already exists', HttpStatus.BAD_REQUEST);
    }

    const result = await this.albumModel.create({
      ...createAlbumDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    if (!result) {
      throw new HttpException(
        'Create new Album failed',
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

    const totalItems = (await this.albumModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultpageSize);

    const data = await this.albumModel
      .find(filter)
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
    const result = await this.albumModel
      .findById(id)
      .populate(defaultPopulation);

    if (!result) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async fetchAlbumRelated(
    releasedById: string,
    query: {
      sort?: string;
      limit?: number;
      skip?: number;
      select?: string;
    } = {},
  ) {
    const { sort = '-createdAt', limit = 10, skip = 0, select } = query;

    const result = await this.albumModel
      .find({ releasedBy: releasedById })
      .populate(defaultPopulation)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    if (select) {
      result.forEach((doc: any) => doc.select(select));
    }

    if (!result || result.length === 0) {
      throw new HttpException('No albums found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumsDto, user: IUser) {
    const result = await this.albumModel.updateOne(
      { _id: id },
      {
        ...updateAlbumDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    if (result) return await this.albumModel.findById(id);
  }
  async updateAddLibrary(id: string, date: Date | null, user: IUser) {
    const result = await this.albumModel.updateOne(
      { _id: id },
      {
        addLibraryAt: date,
      },
    );

    if (result) return await this.albumModel.findById(id);
  }

  async remove(id: string, user) {
    await this.albumModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    const result = await this.albumModel.softDelete({
      _id: id,
    });

    if (result.deleted < 1) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async updateCountLike(id: string, quantity: number, user: IUser) {
    const Album = await this.albumModel.findById(id);

    if (!Album) throw new Error('Album not found');

    const newCountLike = Math.max(0, (Album.countLike || 0) + quantity); // Đảm bảo không âm

    const result = await this.albumModel.updateOne(
      { _id: id },
      {
        $set: { countLike: newCountLike }, // Gán giá trị mới
        updatedBy: user._id,
      },
    );

    return result;
  }
}
