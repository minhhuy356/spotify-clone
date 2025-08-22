import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { genSaltSync, hashSync } from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser, TOrder } from '@/users/users.interface';
import aqp from 'api-query-params';

import { GenresService } from '@/genres/Genres.service';
import { ArtistsService } from '@/artists/artists.service';
import { Types } from 'mongoose';
import {
  TrackArtist,
  TrackArtistDocument,
} from './schemas/track-artist.schema';
import { UpdateTrackArtistsDto } from './dto/update-track-artist.dto';
import { CreateTrackArtistsDto } from './dto/create-track-artist.dto';
import { TracksService } from '@/tracks/tracks.service';
import path from 'path';
import { TrackArtistsModule } from './track-artist.module';

const defaultPopulation = [
  {
    path: 'track',
    populate: [
      { path: 'genres' },
      { path: 'releasedBy' },
      {
        path: 'album',
        match: { _id: { $exists: true } },
        populate: [{ path: 'releasedBy' }],
      },
      {
        path: 'tags',
      },
    ],
  },
  {
    path: 'artist',
  },
  {
    path: 'artistTypeDetail',
    populate: {
      path: 'artistTypeGroup',
    },
  },
];

export interface TrackArtistItem {
  track: any;
  artist: any;
  artistTypeDetail: any;
  useStageName: boolean;
}

export function groupTracksById(data: TrackArtistItem[]): any[] {
  const grouped = data.reduce(
    (acc, item) => {
      if (!item.track || !(item.track as any)._id?.toString()) {
        return acc;
      }

      const trackId = (item.track as any)._id.toString();

      if (!acc[trackId]) {
        acc[trackId] = {
          ...item.track,
          artists: [],
        };
      }

      acc[trackId].artists.push({
        artist: item.artist,
        artistTypeDetail: item.artistTypeDetail,
        useStageName: item.useStageName,
      });

      return acc;
    },
    {} as Record<string, any>,
  );

  return Object.values(grouped);
}

@Injectable()
export class TrackArtistsService {
  constructor(
    @InjectModel(TrackArtist.name)
    private trackArtistModel: SoftDeleteModel<TrackArtistDocument>,
    private artistService: ArtistsService,
    private genreService: GenresService,
    private trackService: TracksService,
  ) {}

  async create(createTrackArtistDto: CreateTrackArtistsDto, user: IUser) {
    const createNewTrack = await this.trackService.create(
      createTrackArtistDto.track,
      user,
    );

    await Promise.all(
      createTrackArtistDto.artists.map((item) =>
        this.trackArtistModel.create({
          track: createNewTrack._id,
          artist: item.artist,
          artistTypeDetail: item.artistTypeDetail,
          useStageName: item.useStageName,
          createdBy: user._id,
        }),
      ),
    );

    return this.findById(createNewTrack._id.toString());
  }

  async findAll(current?: number, pageSize?: number, qs?: string) {
    const { filter, sort } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+current - 1) * +pageSize;
    let defaultPageSize = +pageSize ? +pageSize : 1000;

    const rawData = await this.trackArtistModel
      .find(filter)
      .skip(offset)
      .limit(defaultPageSize)
      .sort(sort as any)
      .populate(defaultPopulation)
      .lean()
      .exec();

    const groupedDataObject = rawData.reduce((acc, item) => {
      const trackId = (item.track as any)._id.toString();

      if (!acc[trackId]) {
        acc[trackId] = {
          ...item.track,
          artists: [],
        };
      }
      acc[trackId].artists.push({
        artist: item.artist,
        artistTypeDetail: item.artistTypeDetail,
        useStageName: item.useStageName,
      });
      return acc;
    }, {});
    const groupedData = Object.values(groupedDataObject);

    const totalTracks = Object.keys(groupedData).length;
    const safePageSize = pageSize && pageSize > 0 ? pageSize : 10;
    const safeCurrent = current && current > 0 ? current : 1;

    return {
      meta: {
        current: safeCurrent,
        pageSize: safePageSize,
        pages: totalTracks > 0 ? Math.ceil(totalTracks / safePageSize) : 1,
        total: totalTracks,
      },
      result: groupedData,
    };
  }

  async findById(id: string) {
    const rawData = await this.trackArtistModel
      .find({ track: id })
      .populate(defaultPopulation)
      .lean()
      .exec();

    if (!rawData) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }

    const groupedData = rawData.reduce((acc, item) => {
      const trackId = (item.track as any)._id.toString();

      if (!acc[trackId]) {
        acc[trackId] = {
          ...item.track,
          artists: [],
        };
      }
      acc[trackId].artists.push({
        artist: item.artist,
        artistTypeDetail: item.artistTypeDetail,
        useStageName: item.useStageName,
      });
      return acc;
    }, {});

    return Object.values(groupedData)[0];
  }

  async update(
    id: string,
    updateTrackArtistDto: UpdateTrackArtistsDto,
    user: IUser,
  ) {
    const existingTrack = await this.trackService.findById(id);
    if (!existingTrack) {
      throw new NotFoundException('Track not found');
    }

    const updatedTrack = await this.trackService.update(
      id,
      updateTrackArtistDto.track,
      user,
    );

    const existingTrackArtists = await this.trackArtistModel.find({
      track: id,
    });

    const existingArtistsMap = new Map(
      existingTrackArtists.map((a) => [a.artist.toString(), a]),
    );

    const newArtistsMap = new Map(
      updateTrackArtistDto.artists.map((a) => [a.artist.toString(), a]),
    );

    const artistsToDelete = existingTrackArtists.filter(
      (a) => !newArtistsMap.has(a.artist.toString()),
    );
    if (artistsToDelete.length > 0) {
      await this.trackArtistModel.deleteMany({
        _id: { $in: artistsToDelete.map((a) => a._id) },
      });
    }

    await Promise.all(
      updateTrackArtistDto.artists.map(async (item) => {
        if (existingArtistsMap.has(item.artist.toString())) {
          const existingArtist = existingArtistsMap.get(item.artist.toString());
          if (
            existingArtist.artistTypeDetail.toString() !==
              item.artistTypeDetail.toString() ||
            existingArtist.useStageName !== item.useStageName
          ) {
            await this.trackArtistModel.updateOne(
              { _id: existingArtist._id },
              {
                artistTypeDetail: item.artistTypeDetail,
                useStageName: item.useStageName,
                updatedBy: user._id,
              },
            );
          }
        } else {
          await this.trackArtistModel.create({
            track: id,
            artist: item.artist,
            artistTypeDetail: item.artistTypeDetail,
            useStageName: item.useStageName,
            createdBy: user._id,
          });
        }
      }),
    );

    return this.findById(id);
  }

  async remove(id: string, user: IUser) {
    const existingTrack = await this.trackService.findById(id);
    if (!existingTrack) {
      throw new NotFoundException('Track not found');
    }

    await this.trackService.remove(id, user);

    const removeResult = await this.trackArtistModel.deleteMany(
      { track: id },
      { isDeleted: true, deletedBy: user._id },
    );

    if (removeResult.deletedCount < 1) {
      throw new HttpException(
        'No TrackArtist found to delete',
        HttpStatus.NOT_FOUND,
      );
    }

    return removeResult;
  }

  async findByGenresName(body: {
    genres: string[];
    limit: number;
    matchMode?: 'every' | 'some';
  }) {
    const { genres, limit, matchMode = 'some' } = body;

    if (!genres || !Array.isArray(genres) || genres.length === 0) {
      throw new BadRequestException('Genres must be a non-empty array');
    }

    const genreIds = (
      await Promise.all(
        genres.map((genre) => this.genreService.findByName(genre)),
      )
    )
      .filter((g) => g)
      .map((g) => g._id.toString());

    if (genreIds.length === 0) {
      return [];
    }

    const rawData = await this.trackArtistModel
      .find()
      .populate(defaultPopulation)
      .lean()
      .exec();

    const filteredData = rawData.filter((item) => {
      if (!item.track || !(item.track as any).genres) return false;

      const trackGenreIds = (item.track as any).genres.map((g) =>
        g._id.toString(),
      );

      return matchMode === 'every'
        ? genreIds.every((id) => trackGenreIds.includes(id))
        : genreIds.some((id) => trackGenreIds.includes(id));
    });

    const groupedData = filteredData.reduce((acc, item) => {
      const trackId = (item.track as any)._id.toString();

      if (!acc[trackId]) {
        acc[trackId] = {
          ...item.track,
          artists: [],
        };
      }
      acc[trackId].artists.push({
        artist: item.artist,
        artistTypeDetail: item.artistTypeDetail,
        useStageName: item.useStageName,
      });
      return acc;
    }, {});

    return Object.values(groupedData).slice(0, limit);
  }

  async findAllTrackByArtist(artistId: string, sortBy?: string) {
    const rawData = await this.trackArtistModel
      .find({ artist: artistId })
      .populate(defaultPopulation)
      .lean()
      .exec();

    const groupedData = rawData.reduce(
      (acc, item) => {
        if (!item.track || !(item.track as any)._id.toString()) {
          return acc;
        }
        const trackId = (item.track as any)._id.toString();

        if (!acc[trackId]) {
          acc[trackId] = {
            ...item.track,
            artists: [],
          };
        }
        acc[trackId].artists.push({
          artist: item.artist,
          artistTypeDetail: item.artistTypeDetail,
          useStageName: item.useStageName,
        });
        return acc;
      },
      {} as Record<string, any>,
    );

    let finalTracks = Object.values(groupedData);

    if (sortBy) {
      const isDescending = sortBy.startsWith('-');
      const sortField = isDescending ? sortBy.substring(1) : sortBy;

      finalTracks.sort((a, b) => {
        const valueA = a[sortField] || 0;
        const valueB = b[sortField] || 0;
        return isDescending ? valueB - valueA : valueA - valueB;
      });
    }

    return finalTracks;
  }

  async findAllTrackByAlbum(albumId: string) {
    const rawData = await this.trackArtistModel
      .find()
      .populate(defaultPopulation)
      .lean()
      .exec();

    const filteredData = rawData.filter((item) => {
      return (
        (item.track as any).album &&
        (item.track as any).album._id.toString() === albumId
      );
    });

    const groupedData = filteredData.reduce((acc, item) => {
      const trackId = (item.track as any)._id.toString();

      if (!acc[trackId]) {
        acc[trackId] = {
          ...item.track,
          artists: [],
        };
      }
      acc[trackId].artists.push({
        artist: item.artist,
        artistTypeDetail: item.artistTypeDetail,
        useStageName: item.useStageName,
      });
      return acc;
    }, {});

    return Object.values(groupedData).sort(
      (a: any, b: any) => a.order - b.order,
    );
  }

  async fetchTrackByInfor(body, user: IUser) {
    const { artistsId, genresId, sortBy, order, limit, tracksId } = body;

    const exceptTracksId = [...tracksId];

    const takenTrack = [];

    let trackByGenres = [];
    let fallbackTracks = [];

    const trackByArtist = await this.findTrackByArtist({
      artistsId,
      tracksId: exceptTracksId,
      limit,
      sortBy,
      order,
    });

    trackByArtist.forEach((item) => {
      exceptTracksId.push(String(item._id));
      takenTrack.push(String(item._id));
    });

    const neededMore = limit - trackByArtist.length;

    if (neededMore > 0) {
      trackByGenres = await this.findTrackByGenresId(
        {
          genresId,
          tracksId: exceptTracksId,
          limit: neededMore,
          sortBy,
          order,
        },
        user,
      );

      trackByGenres.forEach((item) => {
        exceptTracksId.push(String(item._id));
        takenTrack.push(String(item._id));
      });

      if (trackByGenres.length < neededMore) {
        const stillNeed = neededMore - trackByGenres.length;

        fallbackTracks = await this.fetchTrackTopForAutomatic(
          stillNeed,
          takenTrack,
        );

        fallbackTracks.forEach((item) => {
          takenTrack.push(String(item._id));
        });
      }
    }

    return [...trackByArtist, ...trackByGenres, ...fallbackTracks];
  }

  async findTrackByArtist(body: {
    artistsId: string[];
    tracksId: string[];
    limit: number;
    sortBy?: string;
    order?: TOrder;
  }) {
    const { artistsId, tracksId, sortBy, order = 'desc', limit } = body;

    if (!Array.isArray(artistsId)) {
      throw new HttpException(
        'Artist must be an array',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (artistsId.length === 0) {
      return [];
    }

    const filter: Record<string, any> = {
      'track.releasedBy': {
        $in: artistsId.map((id) => new Types.ObjectId(id)),
      },
    };

    if (tracksId.length > 0) {
      filter['track._id'] = {
        $nin: tracksId.map((id) => new Types.ObjectId(id)),
      };
    }

    const result = await this.trackArtistModel
      .find(filter)
      .populate(defaultPopulation)
      .sort({
        [sortBy || 'createdAt']: order === 'asc' ? 1 : -1,
      })
      .limit(limit)
      .lean()
      .exec();

    const groupedData = groupTracksById(result);

    return groupedData;
  }
  async findTrackByGenresId(
    body: {
      genresId: string[];
      tracksId: string[];
      limit: number;
      sortBy?: string;
      order?: TOrder;
    },
    user,
  ) {
    const { genresId, tracksId, sortBy, order = 'desc', limit } = body;

    if (!Array.isArray(genresId)) {
      throw new HttpException(
        'Genres must be an array',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (genresId.length === 0) {
      return [];
    }

    const trackFilter: any = {
      genres: { $in: genresId.map((id) => new Types.ObjectId(id)) },
    };

    if (tracksId.length > 0) {
      trackFilter['_id'] = {
        $nin: tracksId.map((id) => new Types.ObjectId(id)),
      };
    }

    const result = await this.trackArtistModel
      .find({ track: { $in: tracksId } })
      .populate(defaultPopulation)
      .sort({
        [sortBy || 'createdAt']: order === 'asc' ? 1 : -1,
      })
      .limit(limit)
      .lean()
      .exec();

    const groupedData = groupTracksById(result);

    return groupedData;
  }

  async fetchTrackTopForAutomatic(limit: number, takenTrack: string[]) {
    const filter: any = {};

    if (takenTrack.length > 0) {
      filter.track = {
        $nin: takenTrack.map((id) => new Types.ObjectId(id)),
      };
    }

    const result = await this.trackArtistModel
      .find(filter)
      .populate(defaultPopulation)
      .sort({ 'track.countPlay': -1 })
      .limit(limit)
      .lean()
      .exec();
    const groupedData = groupTracksById(result);

    return groupedData;
  }
  async findTrackByTag(
    tagId: string,
    sortBy?: string,
    takenTracksId?: string[],
  ) {
    const tracks = (await this.findAll()).result as any;

    let filteredTracks = tracks.filter((track) =>
      track.tags?.some((tag) => tag._id.toString() === tagId.toString()),
    );

    const beforeTakenFilter = [...filteredTracks];

    if (takenTracksId?.length) {
      filteredTracks = filteredTracks.filter(
        (track) => !takenTracksId.includes(track._id.toString()),
      );

      if (filteredTracks.length === 0) {
        filteredTracks = beforeTakenFilter;
      }
    }

    let sortField = sortBy;
    let isDescending = false;

    if (sortBy?.startsWith('-')) {
      isDescending = true;
      sortField = sortBy.slice(1);
    }

    const sortedTracks = filteredTracks.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];

      let comparison = 0;

      if (valA instanceof Date || Date.parse(valA)) {
        comparison = new Date(valA).getTime() - new Date(valB).getTime();
      } else if (typeof valA === 'number' && typeof valB === 'number') {
        comparison = valA - valB;
      } else if (typeof valA === 'string' && typeof valB === 'string') {
        comparison = valA.localeCompare(valB);
      }

      return isDescending ? -comparison : comparison;
    });

    return sortedTracks;
  }

  async fetchAlbumsByArtist(
    artistId: string,
    query: {
      sort?: string;
      limit?: number;
      type?: string[];
    } = {},
  ) {
    const {
      limit,
      sort = '-countLike',
      type = ['single', 'album', 'ep'],
    } = query;

    const objectId = new Types.ObjectId(artistId);

    const rawData = await this.trackArtistModel
      .find({ artist: objectId })
      .populate(defaultPopulation)
      .lean()
      .limit(limit ?? 0)
      .sort(sort ?? '')
      .exec();

    const groupedData = groupTracksById(rawData);

    const validTracks: any[] = groupedData.filter((track: any) => {
      const album = track.album;
      if (!album || album.isDeleted) return false;

      if (type?.length && !type.includes(album.type)) return false;

      if (album.type === 'album') {
        return album.releasedBy?._id?.toString() === artistId;
      }

      return true;
    });

    const albumMap = new Map<string, any>();
    for (const track of validTracks) {
      const albumId = track.album._id.toString();
      if (!albumMap.has(albumId)) {
        albumMap.set(albumId, track.album);
      }
    }

    return Array.from(albumMap.values());
  }

  async fetchTrackByGenresAndArtist(
    trackId: string,
    genres: string[],
    artists: string[],
  ) {
    const similarTracks = await this.findTrackExceptId(trackId);

    genres = genres.map((g) => g.toString());
    artists = artists.map((a) => a.toString());

    const matchedTracks = similarTracks
      .map((track: any) => {
        const trackGenreIds = track.genres.map((g) => g._id?.toString?.());
        const trackArtistIds = track.artists.map(
          (a) => a.artist?._id?.toString?.() || a._id?.toString?.(),
        );

        const matchedGenres = genres.filter((id) => trackGenreIds.includes(id));
        const matchedArtists = trackArtistIds.filter((id) =>
          artists.includes(id),
        );

        const isGenreFullyMatched = matchedGenres.length === genres.length;
        const isArtistPartiallyMatched = matchedArtists.length > 0;

        if (!(isGenreFullyMatched || isArtistPartiallyMatched)) return null;

        return {
          ...track,
          matchedGenres,
          matchedArtists,
          matchedReason: {
            genre: isGenreFullyMatched,
            artist: isArtistPartiallyMatched,
          },
        };
      })
      .filter(Boolean);

    return matchedTracks;
  }

  async findTrackExceptId(trackId: string) {
    const rawData = await this.trackArtistModel
      .find({
        track: { $ne: new Types.ObjectId(trackId) },
      })
      .populate(defaultPopulation)
      .lean()
      .exec();

    const groupedDataObject = rawData.reduce((acc, item) => {
      const trackId = (item.track as any)._id.toString();

      if (!acc[trackId]) {
        acc[trackId] = {
          ...item.track,
          artists: [],
        };
      }
      acc[trackId].artists.push({
        artist: item.artist,
        artistTypeDetail: item.artistTypeDetail,
        useStageName: item.useStageName,
      });
      return acc;
    }, {});
    const groupedData = Object.values(groupedDataObject);

    return groupedData;
  }
}
