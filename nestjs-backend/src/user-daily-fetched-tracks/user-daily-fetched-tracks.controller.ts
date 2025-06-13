import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { Public, ResponseMessage, User } from '@/decorator/customize';
import { IUser, TOrder } from '@/users/users.interface';
import { UserDailyFetchedTracksService } from './user-daily-fetched-tracks.service';
import { UpdateUserDailyFetchedTracksDto } from './dto/update-user-daily-fetched-track.dto';
import { CreateUserDailyFetchedTracksDto } from './dto/create-user-daily-fetched-track.dto';

@Controller('user-daily-fetched-tracks')
export class UserDailyFetchedTracksController {
  constructor(
    private readonly UserDailyFetchedTrackService: UserDailyFetchedTracksService,
  ) {}

  @Post()
  @ResponseMessage('Create new UserDailyFetchedTrack')
  create(
    @Body() createUserDailyFetchedTrackDto: CreateUserDailyFetchedTracksDto,
    @User() user: IUser,
  ) {
    return this.UserDailyFetchedTrackService.create(
      createUserDailyFetchedTrackDto,
      user,
    );
  }

  // @Public()
  // @Get()
  // @ResponseMessage('Find All')
  // findAll(
  //   @Query('current') current: number,
  //   @Query('pageSize') pageSize: number,
  //   @Query() qs: string,
  // ) {
  //   return this.UserDailyFetchedTrackService.findAll(+current, +pageSize, qs);
  // }

  @Post('fetch-by-track')
  @ResponseMessage('Find All Tracks of the Day By User')
  findAllTracksOfTheDayByUser(
    @Body()
    body: {
      artistsId: string[];
      genresId: string[];
      sortBy?: string;
      order?: TOrder;
      limit?: number;
    },
    @User() user: IUser,
  ) {
    return this.UserDailyFetchedTrackService.findAllTracksOfTheDayByUser(
      body,
      user,
    );
  }

  @Public()
  @Get(':id')
  @ResponseMessage('Find by id')
  findById(@Param('id') id: string) {
    return this.UserDailyFetchedTrackService.findById(id);
  }

  @Delete(':id')
  @ResponseMessage('Delete by id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.UserDailyFetchedTrackService.remove(id, user);
  }
}
