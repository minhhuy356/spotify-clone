import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { genSaltSync, hashSync } from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Track, TrackDocument } from './schemas/track.schemas';
import { CreateTracksDto } from './dto/create-track.dto';
import { UpdateTracksDto } from './dto/update-track.dto';
import { IUser, TOrder } from '@/users/users.interface';

import aqp from 'api-query-params';
import { UserDocument } from '@/users/schemas/user.schema';
import { UsersService } from '@/users/users.service';

import { GenresService } from '@/genres/Genres.service';
import { ArtistsService } from '@/artists/artists.service';
import { Types } from 'mongoose';
import { ListeningHistorysService } from '@/listening-history/listening-historys.service';
import { AlbumsService } from '@/albums/Albums.service';
import { CreateAlbumsDto } from '@/albums/dto/create-album.dto';
import { FilesService } from '@/files/files.service';
import { TrackQueryDto } from './dto/query-track.dto';

const defaultPopulation = [
  {
    path: 'genres',
  },
  {
    path: 'album',
  },
  {
    path: 'releasedBy',
  },
  {
    path: 'tags',
  },
];

@Injectable()
export class TracksService {
  constructor(
    @InjectModel(Track.name)
    private trackModel: SoftDeleteModel<TrackDocument>,
    private albumService: AlbumsService,
    private artistService: ArtistsService,
    private genreService: GenresService,
    private listeningHistorysService: ListeningHistorysService,
  ) {}

  async create(createTrackDto: CreateTracksDto, user: IUser) {
    const { genres } = createTrackDto;

    const existingTrack = await this.trackModel.findOne({
      title: createTrackDto.title,
    });

    if (existingTrack) {
      throw new HttpException('Track already exists', HttpStatus.BAD_REQUEST);
    }

    if (genres) {
      for (const item of genres) {
        await this.genreService.findById(item.toString());
      }
    }

    if (!createTrackDto.album) {
      const createAlbumDto = new CreateAlbumsDto();

      createAlbumDto.name = createTrackDto.title;
      createAlbumDto.imgUrl = createTrackDto.imgUrl;
      createAlbumDto.releasedBy = createTrackDto.releasedBy;

      const createdAlbum = await this.albumService.create(createAlbumDto, user);

      createTrackDto.album = createdAlbum.id;
    }

    const result = await this.trackModel.create({
      ...createTrackDto,
      user: user._id,
    });

    if (!result) {
      throw new HttpException(
        'Create new Track failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }

  async findAll(current: number, pageSize: number, qs: string) {
    const { filter, sort } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+current - 1) * +pageSize;
    let defaultpageSize = +pageSize ? +pageSize : 10;

    const totalItems = (await this.trackModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultpageSize);

    const data = await this.trackModel
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
    const track = await this.trackModel
      .findById(id)
      .populate(defaultPopulation);

    if (!track) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }

    return track;
  }

  async update(id: string, updateTrackDto: UpdateTracksDto, user: IUser) {
    const result = await this.trackModel.updateOne(
      { _id: id },
      {
        ...updateTrackDto,
        updatedBy: user._id,
      },
    );

    if (result) return await this.trackModel.findById(id);
  }

  async updateAddLibrary(id: string, date: Date | null, user: IUser) {
    const result = await this.trackModel.updateOne(
      { _id: id },
      {
        addLibraryAt: date,
      },
    );

    if (result) return await this.trackModel.findById(id);
  }

  async remove(id: string, user: IUser) {
    await this.trackModel.updateOne(
      { _id: id },
      {
        deletedBy: user._id,
      },
    );

    const remove = await this.trackModel.softDelete({
      _id: id,
    });

    if (remove.deleted < 1) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }

    return {
      result: this.trackModel.findById(id),
    };
  }

  async findTrackByNameGenres(body: { genres: string[]; limit: number }) {
    const { genres, limit } = body;

    if (!Array.isArray(genres)) {
      throw new HttpException(
        'Genres must be an array',
        HttpStatus.BAD_REQUEST,
      );
    }

    const genreIds = await Promise.all(
      genres.map((genre) => this.genreService.findByName(genre)),
    );

    if (genreIds.length === 0) {
      return [];
    }

    const result = await this.trackModel
      .find({ genres: { $all: genreIds } })
      .limit(limit || 20)
      .populate(defaultPopulation);

    return result;
  }

  async fetchTracksByReleasedBy(
    releasedById: string,
    query: {
      sort?: string;
      limit?: number;
    } = {},
  ) {
    const { sort = '-createdAt', limit = 10 } = query;

    const result = await this.trackModel
      .find({ releasedBy: releasedById })
      .populate(defaultPopulation)
      .sort(sort)
      .limit(limit);

    return result;
  }

  async increaseView(body: {
    trackId?: string;
    albumId?: string;
    artistId?: string;
    userId: string;
  }) {
    const { trackId, userId, artistId, albumId } = body;

    if (trackId) {
      await this.findById(trackId);
      await this.trackModel.updateOne(
        { _id: trackId },
        { $inc: { countPlay: 1 } },
      );
    }

    if (albumId && userId) {
      await this.albumService.findById(albumId);
      await this.albumService.updateCountLikeByUserId(albumId, 1, userId);
    }

    if (artistId) {
      await this.artistService.findById(artistId);
      await this.artistService.updateCountLikeByUserId(artistId, 1, userId);
    }

    // Gọi recordPlay cuối cùng nếu có userId
    if (userId) {
      return await this.listeningHistorysService.recordPlay(
        trackId,
        albumId,
        artistId,
        userId,
      );
    }

    return { message: 'No action performed' };
  }

  async checkSkip(body: { durationPresent: number; trackId: string }) {
    const { trackId, durationPresent } = body;
    const track = await this.findById(trackId);
    const durationMin = (track.duration * 3) / 10;

    if (durationPresent < durationMin) {
      const result = await this.trackModel.updateOne(
        { _id: trackId },
        { $inc: { countSkip: 1 } },
      );
      return { result };
    }
    return false;
  }

  async increaseLike(id: string, quantity: number, user: IUser) {
    const track = await this.trackModel.findById(id);

    const newCountLike = Math.max(0, (track.countLike || 0) + quantity); // Đảm bảo không âm

    const result = await this.trackModel.updateOne(
      { _id: id },
      {
        $inc: { countLike: newCountLike },
        updatedBy: user._id,
      },
    );

    return result;
  }

  async findTracksByAlbum(albumId: string) {
    const result = await this.trackModel.find({ album: albumId });

    return result;
  }

  async updateTrackScores() {
    const tracks = await this.trackModel.find();

    for (const t of tracks) {
      let likeRatio = 0;
      let skipRatio = 0;

      if (t.countPlay && t.countPlay > 0) {
        likeRatio = (t.countLike * 10) / t.countPlay;
        skipRatio = t.countSkip / t.countPlay;
      }

      let score = (likeRatio * 0.7 - skipRatio * 0.3) * 100;
      if (isNaN(score) || !isFinite(score)) score = 0;

      await this.trackModel.updateOne({ _id: t._id }, { score });
    }
  }

  async updateAlbumScores() {
    const albums = (await this.albumService.findAll()).result;
    const tracks = await this.trackModel.find();

    const albumStatsMap = new Map<
      string,
      { totalPlay: number; totalSkip: number }
    >();

    for (const t of tracks) {
      if (t.album && typeof t.countPlay === 'number') {
        const albumIdStr = t.album.toString();
        const current = albumStatsMap.get(albumIdStr) || {
          totalPlay: 0,
          totalSkip: 0,
        };

        albumStatsMap.set(albumIdStr, {
          totalPlay: current.totalPlay + t.countPlay,
          totalSkip: current.totalSkip + (t.countSkip || 0),
        });
      }
    }

    for (const album of albums) {
      const albumIdStr = album._id.toString();
      const stats = albumStatsMap.get(albumIdStr) || {
        totalPlay: 0,
        totalSkip: 0,
      };

      const { totalPlay, totalSkip } = stats;

      let score = 0;

      if (totalPlay > 0) {
        const likeRatio = (album.countLike * 10) / totalPlay;
        const skipRatio = totalSkip / totalPlay;

        score = (likeRatio * 0.7 - skipRatio * 0.3) * 100;
      }

      score = Math.max(0, Math.min(score, 100));

      await this.albumService.updateScore(albumIdStr, score);
    }
  }
}
