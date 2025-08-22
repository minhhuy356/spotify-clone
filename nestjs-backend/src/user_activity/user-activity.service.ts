import {
  BadGatewayException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { genSaltSync, hashSync } from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from '@/users/users.interface';
import aqp from 'api-query-params';
import {
  UserActivity,
  UserActivityDocument,
} from './schemas/user-activity.schemas';
import { CreateUserActivitysDto } from './dto/create-user-activity.dto';
import { UpdateUserActivitysDto } from './dto/update-user-activity.dto';

import { TracksService } from '@/tracks/tracks.service';
import { ArtistsService } from '@/artists/artists.service';
import { AlbumsService } from '@/albums/Albums.service';
import path from 'path';
import { UserActivitysModule } from './user-activity.module';
import { ListeningHistorysService } from '@/listening-history/listening-historys.service';
import { TrackArtistsService } from '@/track-artist/track-artist.service';
const populate = [
  {
    path: 'artists',
  },
  {
    path: 'user',
  },
  {
    path: 'albums',
    populate: {
      path: 'releasedBy',
    },
  },
  {
    path: 'tracks',
  },
  {
    path: 'playlists',
  },
  {
    path: 'folders',
  },
];

@Injectable()
export class UserActivitysService {
  constructor(
    @InjectModel(UserActivity.name)
    private userActivityModel: SoftDeleteModel<UserActivityDocument>,
    private albumService: AlbumsService,
    private trackService: TracksService,
    private trackArtistService: TrackArtistsService,
    private artistService: ArtistsService,
    private listeningHistorysService: ListeningHistorysService,
  ) {}

  async CreateNewUserActivity(createUserActivityDto: CreateUserActivitysDto) {
    const alreadtExistsUser = this.userActivityModel.findOne({
      user: createUserActivityDto.user.toString(),
    });

    if (alreadtExistsUser) {
      throw new HttpException('User is already exists!', HttpStatus.FOUND);
    }

    return await this.userActivityModel.create(createUserActivityDto);
  }

  async create(user: string) {
    return await this.userActivityModel.create({ user });
  }

  async findAll(current: number, pageSize: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+current - 1) * +pageSize;
    let defaultpageSize = +pageSize ? +pageSize : 10;

    const totalItems = (await this.userActivityModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultpageSize);

    const defaultPopulation = [
      {
        path: 'tracks',
        select: '_id name imgUrl trackUrl',
      },
      {
        path: 'user',
        select: '_id name email',
      },
    ];

    const data = await this.userActivityModel
      .find(filter)
      .skip(offset)
      .limit(defaultpageSize)
      .sort(sort as any)
      .populate(defaultPopulation)
      .select(projection as any)
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

  async getTrackSubscribedByUser(
    user: IUser,
    current: number,
    pageSize: number,
    qs: string,
  ) {
    const { filter, sort, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+current - 1) * +pageSize;
    let defaultpageSize = +pageSize ? +pageSize : 10;

    const totalItems = (await this.userActivityModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultpageSize);

    const data = await this.userActivityModel
      .find({ user: user._id })
      .skip(offset)
      .limit(defaultpageSize)
      .sort(sort as any)
      .populate(populate)
      .select(projection as any)
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
    const result = await this.userActivityModel
      .findOne({
        user: id,
      })
      .populate(populate);

    if (!result) {
      throw new HttpException('UserActivity not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async update(
    id: string,
    updateUserActivityDto: UpdateUserActivitysDto,
    user: IUser,
  ) {
    const result = await this.userActivityModel.updateOne(
      { _id: id },
      {
        ...updateUserActivityDto,
        updatedBy: user._id,
      },
    );

    if (result) return await this.userActivityModel.findById(id);
  }

  async remove(id: string, user: IUser) {
    await this.userActivityModel.updateOne(
      { _id: id },
      {
        deletedBy: user._id,
      },
    );

    const remove = await this.userActivityModel.softDelete({
      _id: id,
    });

    if (remove.deleted < 1) {
      throw new HttpException('UserActivity not found', HttpStatus.NOT_FOUND);
    }

    const result = {
      statusCode: HttpStatus.OK,
      message: 'Delete UserActivity by id',
      data: {
        result: remove,
      },
    };

    return result;
  }

  async SubscribeTrack(
    createUserActivityDto: CreateUserActivitysDto,
    user: IUser,
  ) {
    const { quantity, track } = createUserActivityDto;

    await this.trackService.findById(track.toString());

    await this.trackService.increaseLike(track.toString(), quantity, user);

    const existingUser = await this.userActivityModel.findOne({
      user: user._id,
    });

    if (existingUser) {
      const trackUpdate =
        quantity === 1
          ? { $push: { tracks: track } }
          : quantity === -1
            ? { $pull: { tracks: track } }
            : null;

      if (trackUpdate) {
        const result = await this.userActivityModel.updateOne(
          { user: user._id },
          { ...trackUpdate, updatedBy: user._id, user: user._id },
        );

        if (result) {
          return await this.trackService.updateAddLibrary(
            track.toString(),
            quantity === -1 ? null : new Date(),
            user,
          );
        }
      }
    } else {
      const result = await this.userActivityModel.create({
        tracks: [track],
        user: user._id,
      });

      if (result) {
        return await this.trackService.updateAddLibrary(
          track.toString(),
          new Date(),
          user,
        );
      }
    }
  }

  async SubscribeArtist(
    createUserActivityDto: CreateUserActivitysDto,
    user: IUser,
  ) {
    const { quantity, artist } = createUserActivityDto;

    await this.artistService.findById(artist.toString());

    await this.artistService.updateCountLike(artist.toString(), quantity, user);

    const existingUser = await this.userActivityModel.findOne({
      user: user._id,
    });

    if (existingUser) {
      const artistUpdate =
        quantity === 1
          ? { $push: { artists: artist } }
          : quantity === -1
            ? { $pull: { artists: artist } }
            : null;

      if (artistUpdate) {
        const result = await this.userActivityModel.updateOne(
          { user: user._id },
          { ...artistUpdate, updatedBy: user._id, user: user._id },
        );

        if (result) {
          return await this.artistService.updateAddLibrary(
            artist.toString(),
            quantity === -1 ? null : new Date(),
            user,
          );
        }
      }
    } else {
      const result = await this.userActivityModel.create({
        artists: [artist],
        user: user._id,
      });

      if (result) {
        return await this.artistService.updateAddLibrary(
          artist.toString(),
          new Date(),
          user,
        );
      }
    }
  }

  async SubscribeAlbum(
    createUserActivityDto: CreateUserActivitysDto,
    user: IUser,
  ) {
    const { quantity, album } = createUserActivityDto;

    await this.albumService.findById(album.toString());

    await this.albumService.updateCountLike(album.toString(), quantity, user);

    const existingUser = await this.userActivityModel.findOne({
      user: user._id,
    });

    if (existingUser) {
      const albumUpdate =
        quantity === 1
          ? { $push: { albums: album } }
          : quantity === -1
            ? { $pull: { albums: album } }
            : null;

      if (albumUpdate) {
        const result = await this.userActivityModel.updateOne(
          { user: user._id },
          { ...albumUpdate, updatedBy: user._id, user: user._id },
        );

        if (result) {
          return await this.albumService.updateAddLibrary(
            album.toString(),
            quantity === -1 ? null : new Date(),
            user,
          );
        }
      }
    } else {
      const result = await this.userActivityModel.create({
        albums: [album],
        user: user._id,
      });

      if (result) {
        return await this.albumService.updateAddLibrary(
          album.toString(),
          new Date(),
          user,
        );
      }
    }
  }

  async UpdateFolder(folderId: string, userId: string, quantity: number) {
    if (quantity === 1) {
      return await this.userActivityModel.updateOne(
        { user: userId },
        { $push: { folders: folderId }, updatedBy: userId },
      );
    } else {
      return await this.userActivityModel.updateOne(
        { user: userId },
        { $pull: { folders: folderId }, updatedBy: userId },
      );
    }
  }

  async UpdatePlaylist(playlistId: string, userId: string, quantity: number) {
    if (quantity === 1) {
      return await this.userActivityModel.updateOne(
        { user: userId },
        { $push: { playlists: playlistId }, updatedBy: userId },
      );
    } else {
      return await this.userActivityModel.updateOne(
        { user: userId },
        { $pull: { playlists: playlistId }, updatedBy: userId },
      );
    }
  }

  async fetchAlbumPropose(trackId: string) {
    const track: any = await this.trackArtistService.findById(trackId);

    const genrensId = track.genres.map((genre: any) => genre._id);
    const artistsId = track.artists.map((artist: any) => artist.artist._id);

    const similarTracks =
      await this.trackArtistService.fetchTrackByGenresAndArtist(
        trackId,
        genrensId,
        artistsId,
      );

    const albumIds = [...new Set(similarTracks.map((t: any) => t.album._id))];

    const albums = (
      await this.albumService.fetchManyAlbumByIds(albumIds)
    ).filter(
      (album: any) => album._id.toString() !== track.album._id.toString(),
    );
    return albums;
  }

  async fetchArtistAlsoLiked(artistId: string) {
    const query: any = {
      artists: artistId,
    };

    const activities = await this.userActivityModel
      .find(query)
      .populate(populate);

    if (activities.length === 0) return [];

    const allArtists = activities.flatMap((item) => item.artists);

    const uniqueArtistsMap = new Map<string, any>();
    for (const artist of allArtists) {
      if (
        artist._id.toString() !== artistId &&
        !uniqueArtistsMap.has(artist._id.toString())
      ) {
        uniqueArtistsMap.set(artist._id.toString(), artist);
      }
    }

    return Array.from(uniqueArtistsMap.values());
  }
}
