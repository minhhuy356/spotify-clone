import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { genSaltSync, hashSync } from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Artist, ArtistDocument } from './schemas/artist.schema';
import { CreateArtistsDto } from './dto/create-artists.dto';
import { UpdateArtistsDto } from './dto/update-artists.dto';
import { IUser } from '@/users/users.interface';

import aqp from 'api-query-params';
import { ChooseByArtistsService } from '@/choose-by-artist/choose-by-artist.service';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectModel(Artist.name)
    private artistModel: SoftDeleteModel<ArtistDocument>,
    private chooseByArtistService: ChooseByArtistsService,
  ) {}

  async create(createArtistDto: CreateArtistsDto, user: IUser) {
    const existingArtist = await this.artistModel.findOne({
      stageName: createArtistDto.stageName,
    });

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
    } else {
      await this.chooseByArtistService.create(result._id.toString(), user);
      return result;
    }
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
        current: current,
        pageSize: pageSize,
        pages: totalPages,
        total: totalItems,
      },
      result: data,
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
    if (result) return await this.artistModel.findById(id);
  }
  async updateAddLibrary(id: string, date: Date | null, user: IUser) {
    const result = await this.artistModel.updateOne(
      { _id: id },
      {
        addLibraryAt: date,
      },
    );

    if (result) return await this.artistModel.findById(id);
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

    const newCountLike = Math.max(0, (artist.countLike || 0) + quantity);

    const result = await this.artistModel.updateOne(
      { _id: id },
      {
        $set: { countLike: newCountLike },
        updatedBy: user._id,
      },
    );

    return result;
  }

  async updateCountLikeByUserId(id: string, quantity: number, userId: string) {
    const artist = await this.artistModel.findById(id);

    if (!artist) throw new Error('Artist not found');

    const newCountLike = Math.max(0, (artist.countLike || 0) + quantity);

    const result = await this.artistModel.updateOne(
      { _id: id },
      {
        $set: { countLike: newCountLike },
        updatedBy: userId,
      },
    );

    return result;
  }

  async fetchArtistAlsoLiked(uniqueArtistIds: string[]) {
    return this.artistModel
      .find({ _id: { $in: uniqueArtistIds } })
      .select('_id name image')
      .lean();
  }
}
