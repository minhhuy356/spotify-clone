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
import { IUser } from '@/users/users.interface';
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

const defaultPopulation = [
  {
    path: 'track',
    populate: [{ path: 'genres' }, { path: 'releasedBy' }],
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

@Injectable()
export class TrackArtistsService {
  constructor(
    @InjectModel(TrackArtist.name)
    private trackArtistModel: SoftDeleteModel<TrackArtistDocument>,
    private artistService: ArtistsService,
    private genreService: GenresService,
    private trackService: TracksService,
  ) {}

  hashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);

    return hash;
  };

  async create(createTrackArtistDto: CreateTrackArtistsDto, user: IUser) {
    // 1️⃣ Tạo Track mới
    const createNewTrack = await this.trackService.create(
      createTrackArtistDto.track,
      user,
    );

    // 2️⃣ Tạo danh sách TrackArtist mới
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

    // 3️⃣ Truy vấn lại dữ liệu theo format `findById`
    return this.findById(createNewTrack._id.toString());
  }

  async findAll(current: number, pageSize: number, qs: string) {
    const { filter, sort } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+current - 1) * +pageSize;
    let defaultPageSize = +pageSize ? +pageSize : 10;

    // Truy vấn dữ liệu từ database
    const rawData = await this.trackArtistModel
      .find(filter)
      .skip(offset)
      .limit(defaultPageSize)
      .sort(sort as any)
      .populate(defaultPopulation)
      .lean() // ✅ Chuyển Mongoose Document thành Object thuần
      .exec();

    // Gộp các bài hát có cùng `track._id`
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
      result: Object.values(groupedData),
    };
  }

  async findById(id: string) {
    // Truy vấn dữ liệu từ database
    const rawData = await this.trackArtistModel
      .find({ track: id })
      .populate(defaultPopulation)
      .lean() // ✅ Chuyển Mongoose Document thành Object thuần
      .exec();

    if (!rawData) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }

    // Gộp các bài hát có cùng `track._id`
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

    return Object.values(groupedData);
  }

  async update(
    id: string,
    updateTrackArtistDto: UpdateTrackArtistsDto,
    user: IUser,
  ) {
    // 1️⃣ Kiểm tra xem Track có tồn tại không
    const existingTrack = await this.trackService.findById(id);
    if (!existingTrack) {
      throw new NotFoundException('Track not found');
    }

    // 2️⃣ Cập nhật thông tin Track
    const updatedTrack = await this.trackService.update(
      id,
      updateTrackArtistDto.track,
      user,
    );

    // 3️⃣ Lấy danh sách TrackArtist hiện tại trong DB
    const existingTrackArtists = await this.trackArtistModel.find({
      track: id,
    });

    // 4️⃣ Chuyển đổi dữ liệu về dạng dễ kiểm tra
    const existingArtistsMap = new Map(
      existingTrackArtists.map((a) => [a.artist.toString(), a]),
    );

    const newArtistsMap = new Map(
      updateTrackArtistDto.artists.map((a) => [a.artist.toString(), a]),
    );

    // 5️⃣ Xóa các TrackArtist không còn trong danh sách
    const artistsToDelete = existingTrackArtists.filter(
      (a) => !newArtistsMap.has(a.artist.toString()),
    );
    if (artistsToDelete.length > 0) {
      await this.trackArtistModel.deleteMany({
        _id: { $in: artistsToDelete.map((a) => a._id) },
      });
    }

    // 6️⃣ Cập nhật hoặc thêm mới TrackArtist
    await Promise.all(
      updateTrackArtistDto.artists.map(async (item) => {
        if (existingArtistsMap.has(item.artist.toString())) {
          // 🎯 Nếu đã tồn tại → Kiểm tra xem có thay đổi không → Cập nhật
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
          // 🎯 Nếu chưa tồn tại → Thêm mới
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

    // 7️⃣ Trả về dữ liệu đầy đủ giống findById()
    return this.findById(id);
  }

  async remove(id: string, user: IUser) {
    // 1️⃣ Kiểm tra xem Track có tồn tại không
    const existingTrack = await this.trackService.findById(id);
    if (!existingTrack) {
      throw new NotFoundException('Track not found');
    }

    // 2️⃣ Cập nhật trạng thái `deleted` của Track trong bảng `tracks`
    await this.trackService.remove(id, user);

    // 3️⃣ Cập nhật trạng thái `deleted` của tất cả TrackArtist liên quan
    const removeResult = await this.trackArtistModel.updateMany(
      { track: id },
      { isDeleted: true, deletedBy: user._id },
    );

    // 4️⃣ Nếu không có TrackArtist nào bị cập nhật, báo lỗi
    if (removeResult.modifiedCount < 1) {
      throw new HttpException(
        'No TrackArtist found to delete',
        HttpStatus.NOT_FOUND,
      );
    }

    // 5️⃣ Trả về thông báo thành công
    return removeResult;
  }

  async findAllByGenres(body: {
    genres: string[];
    limit: number;
    matchMode?: 'every' | 'some';
  }) {
    const { genres, limit, matchMode = 'some' } = body; // Mặc định là 'some'
    console.log(body);

    if (!genres || !Array.isArray(genres) || genres.length === 0) {
      throw new BadRequestException('Genres must be a non-empty array');
    }

    // ✅ Lấy danh sách ID của genres
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

    // ✅ Truy vấn tất cả track-artist có track (populate track trước)
    const rawData = await this.trackArtistModel
      .find()
      .populate(defaultPopulation)
      .lean()
      .exec();

    // ✅ Kiểm tra xem track.genres có tồn tại không
    const filteredData = rawData.filter((item) => {
      if (!item.track || !(item.track as any).genres) return false;

      const trackGenreIds = (item.track as any).genres.map((g) =>
        g._id.toString(),
      );

      // ✅ Kiểm tra matchMode để lọc theo 'every' hoặc 'some'
      return matchMode === 'every'
        ? genreIds.every((id) => trackGenreIds.includes(id)) // Tất cả genres phải khớp
        : genreIds.some((id) => trackGenreIds.includes(id)); // Chỉ cần một genre khớp
    });

    // ✅ Gộp bài hát có cùng track._id
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

    // ✅ Chỉ giới hạn kết quả cuối cùng
    return Object.values(groupedData).slice(0, limit);
  }

  async findAllTrackByArtist(artistId: string, sortBy?: string) {
    // ✅ Truy vấn tất cả track-artist có track (populate track trước)
    const rawData = await this.trackArtistModel
      .find({ artist: artistId })
      .populate(defaultPopulation)
      .lean()
      .exec();

    // ✅ Gộp bài hát có cùng track._id
    const groupedData = rawData.reduce(
      (acc, item) => {
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

    // ✅ Chuyển object thành mảng
    let finalTracks = Object.values(groupedData);

    // ✅ Chỉ sắp xếp nếu có tham số sortBy
    if (sortBy) {
      const isDescending = sortBy.startsWith('-');
      const sortField = isDescending ? sortBy.substring(1) : sortBy; // Bỏ dấu "-" nếu có

      finalTracks.sort((a, b) => {
        const valueA = a[sortField] || 0;
        const valueB = b[sortField] || 0;
        return isDescending ? valueB - valueA : valueA - valueB;
      });
    }

    return finalTracks;
  }
}
