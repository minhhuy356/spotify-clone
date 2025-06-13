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
import { TrackPlaysService } from '@/track-plays/track-plays.service';
import { AlbumsService } from '@/albums/Albums.service';
import { CreateAlbumsDto } from '@/albums/dto/create-album.dto';
import { FilesService } from '@/files/files.service';

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
    private genreService: GenresService,
    private trackPlaysService: TrackPlaysService,
  ) {}

  hashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);

    return hash;
  };

  async create(createTrackDto: CreateTracksDto, user: IUser) {
    const { genres } = createTrackDto;

    // Kiểm tra xem email đã tồn tại chưa
    const existingTrack = await this.trackModel.findOne({
      title: createTrackDto.title,
    });
    // Nếu email đã tồn tại thì trả ra lỗi
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

      // Sau khi tạo album mới, bạn có thể gán albumId cho track
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
        current: current, //trang hiện tại
        pageSize: pageSize, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result: data, //kết quả query
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
  // async fetchTrackByInfor(body, user: IUser) {
  //   const { artistsId, genresId, sortBy, order, limit, tracksId } = body;

  //   const exceptTracksId = [...tracksId]; // clone để không mutate input

  //   const takenTrack = [];

  //   let trackByGenres = [];
  //   let fallbackTracks = [];

  //   const trackByArtist = await this.findTrackByArtist(
  //     {
  //       artistsId,
  //       tracksId: exceptTracksId,
  //       limit,
  //       sortBy,
  //       order,
  //     },
  //     user,
  //   );

  //   // Đánh dấu ID đã lấy để loại trừ khỏi bước sau
  //   trackByArtist.forEach((item) => {
  //     exceptTracksId.push(String(item._id));
  //     takenTrack.push(String(item._id));
  //   });

  //   const neededMore = limit - trackByArtist.length;

  //   if (neededMore > 0) {
  //     trackByGenres = await this.findTrackByGenres(
  //       {
  //         genresId,
  //         tracksId: exceptTracksId,
  //         limit: neededMore,
  //         sortBy,
  //         order,
  //       },
  //       user,
  //     );

  //     // Đánh dấu ID đã lấy để loại trừ khỏi bước sau
  //     trackByGenres.forEach((item) => {
  //       exceptTracksId.push(String(item._id));
  //       takenTrack.push(String(item._id));
  //     });

  //     // Nếu vẫn chưa đủ, thử lấy tiếp (bao gồm track đã trùng)
  //     if (trackByGenres.length < neededMore) {
  //       const stillNeed = neededMore - trackByGenres.length;

  //       fallbackTracks = await this.fetchTrackTopForAutomatic(
  //         stillNeed,
  //         takenTrack,
  //       );

  //       // Đánh dấu ID đã lấy để loại trừ khỏi bước sau
  //       fallbackTracks.forEach((item) => {
  //         takenTrack.push(String(item._id));
  //       });
  //     }
  //   }

  //   return [...trackByArtist, ...trackByGenres, ...fallbackTracks];
  // }

  // async findTrackByArtist(
  //   body: {
  //     artistsId: string[];
  //     tracksId: string[];
  //     limit: number;
  //     sortBy?: string;
  //     order?: TOrder;
  //   },
  //   user,
  // ) {
  //   const { artistsId, tracksId, sortBy, order = 'desc', limit } = body;

  //   if (!Array.isArray(artistsId)) {
  //     throw new HttpException(
  //       'Artist must be an array',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   if (artistsId.length === 0) {
  //     return [];
  //   }

  //   const matchStage: Record<string, any> = {};

  //   // Nếu dữ liệu trong collection là: { releasedBy: ObjectId }
  //   matchStage['releasedBy'] = {
  //     $in: artistsId.map((id) => new Types.ObjectId(id)),
  //   };

  //   if (tracksId.length > 0) {
  //     matchStage['_id'] = {
  //       $nin: tracksId.map((id) => new Types.ObjectId(id)),
  //     };
  //   }

  //   const pipeline: any[] = [{ $match: matchStage }];

  //   if (sortBy) {
  //     pipeline.push({
  //       $sort: {
  //         [sortBy]: order === 'asc' ? 1 : -1,
  //       },
  //     });
  //   }

  //   pipeline.push({ $limit: limit });

  //   const result = await this.trackModel.aggregate(pipeline);

  //   return result;
  // }

  // async findTrackByGenres(
  //   body: {
  //     genresId: string[];
  //     tracksId: string[];
  //     limit: number;
  //     sortBy?: string;
  //     order?: TOrder;
  //   },
  //   user,
  // ) {
  //   const { genresId, tracksId, sortBy, order = 'desc', limit } = body;

  //   if (!Array.isArray(genresId)) {
  //     throw new HttpException(
  //       'Artist must be an array',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   if (genresId.length === 0) {
  //     return [];
  //   }

  //   const matchStage: Record<string, any> = {};

  //   // Nếu dữ liệu trong collection là: { genres: ObjectId }
  //   matchStage['genres'] = {
  //     $in: genresId.map((id) => new Types.ObjectId(id)),
  //   };

  //   if (tracksId.length > 0) {
  //     matchStage['_id'] = {
  //       $nin: tracksId.map((id) => new Types.ObjectId(id)),
  //     };
  //   }

  //   const pipeline: any[] = [{ $match: matchStage }];

  //   if (sortBy) {
  //     pipeline.push({
  //       $sort: {
  //         [sortBy]: order === 'asc' ? 1 : -1,
  //       },
  //     });
  //   }

  //   pipeline.push({ $limit: limit });

  //   const result = await this.trackModel.aggregate(pipeline);

  //   return result;
  // }

  // async fetchTrackTopForAutomatic(limit: number, takenTrack: string[]) {
  //   const matchStage: Record<string, any> = {};

  //   if (takenTrack.length > 0) {
  //     matchStage['_id'] = {
  //       $nin: takenTrack.map((id) => new Types.ObjectId(id)),
  //     };
  //   }
  //   const pipeline: any[] = [{ $match: matchStage }];

  //   pipeline.push({
  //     $sort: {
  //       ['countPlay']: -1,
  //     },
  //   });

  //   pipeline.push({ $limit: limit });

  //   return await this.trackModel.aggregate(pipeline);
  // }

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

    // Chỉ lấy các trường cần thiết
    return result;
  }

  async increaseView(body: { trackId: string; userId: string }) {
    const { trackId, userId } = body;
    await this.findById(trackId);

    // Tăng countPlay thêm 1
    const result = await this.trackModel.updateOne(
      { _id: trackId }, // Điều kiện tìm kiếm
      { $inc: { countPlay: 1 } }, // Tăng countPlay lên 1
    );

    if (userId) {
      await this.trackPlaysService.recordPlay(trackId, userId);
    }

    // Lấy lại dữ liệu sau khi cập nhật (nếu cần trả về)
    return { result };
  }

  async increaseLike(id: string, quantity: number, user: IUser) {
    const track = await this.trackModel.findById(id);

    const newCountLike = Math.max(0, (track.countLike || 0) + quantity); // Đảm bảo không âm

    const result = await this.trackModel.updateOne(
      { _id: id },
      {
        $inc: { countLike: newCountLike }, // Gán giá trị mới
        updatedBy: user._id,
      },
    );

    return result;
  }

  async countTracksByAlbum(albumId: string) {
    const result = await this.trackModel
      .find({ album: albumId })
      .sort({ order: 1 }); // 1 là tăng dần, -1 là giảm dần
    return result.length;
  }
}
