import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { genSaltSync, hashSync } from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Album, AlbumDocument } from './schemas/Album.schema';

import { IUser } from '@/users/users.interface';

import aqp from 'api-query-params';
import { CreateAlbumsDto } from './dto/create-album.dto';
import { UpdateAlbumsDto } from './dto/update-album.dto';
import { UserActivitysService } from '@/user_activity/user-activity.service';
import { ListeningHistorysService } from '@/listening-history/listening-historys.service';

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

  async create(createAlbumDto: CreateAlbumsDto, user: IUser) {
    const existingAlbum = await this.albumModel.findOne({
      name: createAlbumDto.name,
    });

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

  async findAll(current?: number, pageSize?: number, qs?: string) {
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
        current: current,
        pageSize: pageSize,
        pages: totalPages,
        total: totalItems,
      },
      result: data,
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
      scoreMin?: number;
      scoreMax?: number;
    } = {},
  ) {
    const {
      sort = '-createdAt',
      limit = 10,
      skip = 0,
      select,
      scoreMin = 0,
      scoreMax = 100,
    } = query;

    const filter: any = {
      releasedBy: releasedById,
      score: { $gte: scoreMin, $lte: scoreMax },
    };

    const result = await this.albumModel
      .find(filter)
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

    const newCountLike = Math.max(0, (Album.countLike || 0) + quantity);

    const result = await this.albumModel.updateOne(
      { _id: id },
      {
        $set: { countLike: newCountLike },
        updatedBy: user._id,
      },
    );

    return result;
  }

  async updateCountLikeByUserId(id: string, quantity: number, userId: string) {
    const Album = await this.albumModel.findById(id);

    if (!Album) throw new Error('Album not found');

    const newCountLike = Math.max(0, (Album.countLike || 0) + quantity);

    const result = await this.albumModel.updateOne(
      { _id: id },
      {
        $set: { countLike: newCountLike },
        updatedBy: userId,
      },
    );

    return result;
  }

  async updateScore(albumId: string, score: number) {
    return await this.albumModel.updateOne({ _id: albumId }, { score: score });
  }

  async fetchAllAlbumByReleasedBy(
    releasedById: string,
    query: {
      sort?: string;
      limit?: number;
      minScore?: number;
      maxScore?: number;
      type?: string[];
    } = {},
  ) {
    const {
      sort = '-releaseDate',
      limit = 20,
      minScore = 0,
      maxScore = 100,
      type = 'single,album,ep',
    } = query;

    return await this.albumModel
      .find({
        releasedBy: releasedById,
        score: { $gte: minScore, $lte: maxScore },
        type: type,
      })
      .sort(sort)
      .limit(limit)
      .populate(defaultPopulation);
  }

  async fetchAlbumScore() {
    return await this.albumModel
      .find({
        score: { $gt: 50 },
        type: 'album',
      })
      .populate(defaultPopulation);
  }
  async fetchManyAlbumByIds(albumIds: string[]) {
    const uniqueAlbumIds = [...new Set(albumIds.map((id) => id.toString()))];

    return await this.albumModel
      .find({
        _id: { $in: uniqueAlbumIds },
        type: 'album',
      })
      .populate(defaultPopulation);
  }
}
