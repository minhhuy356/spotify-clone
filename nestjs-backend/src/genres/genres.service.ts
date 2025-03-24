import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { genSaltSync, hashSync } from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from '@/users/users.interface';
import aqp from 'api-query-params';
import { Genre, GenreDocument } from './schemas/genre.schema';
import { CreateGenresDto } from './dto/create-genre.dto';
import { UpdateGenresDto } from './dto/update-genre.dto';

@Injectable()
export class GenresService {
  constructor(
    @InjectModel(Genre.name)
    private genreModel: SoftDeleteModel<GenreDocument>,
  ) {}

  hashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);

    return hash;
  };

  async create(createGenreDto: CreateGenresDto, user: IUser) {
    const existingGenre = await this.genreModel.findOne({
      name: createGenreDto.name,
    });

    if (existingGenre) {
      throw new HttpException('Genre already exists', HttpStatus.BAD_REQUEST);
    }

    // Chuyển name thành chữ in hoa
    createGenreDto.name = createGenreDto.name.toUpperCase();

    const result = await this.genreModel.create({
      ...createGenreDto,
      createdBy: user._id,
    });

    if (!result) {
      throw new HttpException(
        'Create new Genre failed',
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

    const totalItems = (await this.genreModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultpageSize);

    const data = await this.genreModel
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
    const result = await this.genreModel.findById(id);

    if (!result) {
      throw new HttpException('Genre not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async findByName(name: string) {
    const result = await this.genreModel
      .findOne({
        name: { $regex: new RegExp(`^${name}$`, 'i') }, // 'i' để bỏ phân biệt hoa thường
      })
      .exec();

    if (!result) {
      throw new HttpException('Genre not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async update(id: string, updateGenreDto: UpdateGenresDto, user: IUser) {
    const result = await this.genreModel.updateOne(
      { _id: id },
      {
        ...updateGenreDto,
        updatedBy: user._id,
      },
    );

    return result;
  }

  async remove(id: string, user: IUser) {
    await this.genreModel.updateOne(
      { _id: id },
      {
        deletedBy: user._id,
      },
    );

    const remove = await this.genreModel.softDelete({
      _id: id,
    });

    if (remove.deleted < 1) {
      throw new HttpException('Genre not found', HttpStatus.NOT_FOUND);
    }

    const result = {
      statusCode: HttpStatus.OK,
      message: 'Delete Genre by id',
      data: {
        result: remove,
      },
    };

    return result;
  }
}
