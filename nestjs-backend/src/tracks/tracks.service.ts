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
import { IUser } from '@/users/users.interface';

import aqp from 'api-query-params';
import { UserDocument } from '@/users/schemas/user.schema';
import { UsersService } from '@/users/users.service';

import { GenresService } from '@/genres/Genres.service';
import { ArtistsService } from '@/artists/artists.service';
import { Types } from 'mongoose';
import { TrackPlaysService } from '@/track-plays/track-plays.service';

const defaultPopulation = [
  {
    path: 'genres',
  },

  {
    path: 'releasedBy',
  },
];

@Injectable()
export class TracksService {
  constructor(
    @InjectModel(Track.name)
    private trackModel: SoftDeleteModel<TrackDocument>,
    private artistService: ArtistsService,
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

    return {
      result,
    };
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

  async findTrackByGenres(body: { genres: string[]; limit: number }) {
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
}
