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
import { Tag, TagDocument } from './schemas/tag.schema';
import { CreateTagsDto } from './dto/create-Tag.dto';
import { UpdateTagsDto } from './dto/update-Tag.dto';
import mongoose from 'mongoose';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag.name)
    private TagModel: SoftDeleteModel<TagDocument>,
  ) {}

  hashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);

    return hash;
  };

  async create(createTagDto: CreateTagsDto) {
    // Kiểm tra xem email đã tồn tại chưa
    const existingTag = await this.TagModel.findOne({
      name: createTagDto.name,
    });
    // Nếu email đã tồn tại thì trả ra lỗi
    if (existingTag) {
      throw new HttpException('Tag already exists', HttpStatus.BAD_REQUEST);
    }

    const result = await this.TagModel.create({
      ...createTagDto,
    });

    if (!result) {
      throw new HttpException(
        'Create new Tag failed',
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

    const totalItems = (await this.TagModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultpageSize);

    const data = await this.TagModel.find(filter)
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
    const result = await this.TagModel.findById(id);

    if (!result) {
      throw new HttpException('Tag not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async findOneByName(name: string) {
    const result = await this.TagModel.findOne({ name });

    if (!result) {
      throw new HttpException('Tag not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async update(id: string, updateTagDto: UpdateTagsDto, user: IUser) {
    const result = await this.TagModel.updateOne(
      { _id: id },
      {
        ...updateTagDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    return result;
  }

  async remove(id: string, user) {
    if (!mongoose.Types.ObjectId.isValid(id)) return `not found Tag`;

    const foundUser = await this.TagModel.findById(id);

    if (foundUser.name === 'ADMIN') {
      throw new BadRequestException('Cannot delete Tag ADMIN');
    }

    await this.TagModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    const result = await this.TagModel.softDelete({
      _id: id,
    });

    if (result.deleted < 1) {
      throw new HttpException('Tag not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }
}
