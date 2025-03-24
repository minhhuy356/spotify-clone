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
import { CreateUserActivitysDto } from './dto/create-user-activity.dto';
import { Public, ResponseMessage, User } from '@/decorator/customize';
import { IUser } from '@/users/users.interface';
import { UserActivitysService } from './user-activity.service';
import { UpdateUserActivitysDto } from './dto/update-user-activity.dto';
import { ObjectId } from 'mongoose';

@Controller('user-activity')
export class UserActivitysController {
  constructor(private readonly UserActivityService: UserActivitysService) {}

  @Public()
  @Post('')
  @ResponseMessage('Create new UserActivity')
  CreateNewUserActivity(@Body() createUserActivityDto: CreateUserActivitysDto) {
    return this.UserActivityService.CreateNewUserActivity(
      createUserActivityDto,
    );
  }
  @Public()
  @Post('user')
  @ResponseMessage('Create new UserActivity')
  create(@Body() user: string) {
    return this.UserActivityService.create(user);
  }

  @Post('track')
  @ResponseMessage('Subscribe Track')
  SubscribeTrack(
    @Body() createUserActivityDto: CreateUserActivitysDto,
    @User() user: IUser,
  ) {
    return this.UserActivityService.SubscribeTrack(createUserActivityDto, user);
  }

  @Post('artist')
  @ResponseMessage('Subscribe Artist')
  SubscribeArtist(
    @Body() createUserActivityDto: CreateUserActivitysDto,
    @User() user: IUser,
  ) {
    return this.UserActivityService.SubscribeArtist(
      createUserActivityDto,
      user,
    );
  }

  @Post('album')
  @ResponseMessage('Create new UserActivity')
  UserActivityArtist(
    @Body() createUserActivityDto: CreateUserActivitysDto,
    @User() user: IUser,
  ) {
    return this.UserActivityService.SubscribeAlbum(createUserActivityDto, user);
  }

  @Public()
  @Get()
  @ResponseMessage('Find All')
  findAll(
    @Query('current') current: number,
    @Query('pageSize') pageSize: number,
    @Query() qs: string,
  ) {
    return this.UserActivityService.findAll(+current, +pageSize, qs);
  }
  @Get('user')
  @ResponseMessage('Find All by user')
  getTrackSubscribedByUser(
    @User() user: IUser,
    @Query('current') current: number,
    @Query('pageSize') pageSize: number,
    @Query() qs: string,
  ) {
    return this.UserActivityService.getTrackSubscribedByUser(
      user,
      +current,
      +pageSize,
      qs,
    );
  }

  @Public()
  @Get(':id')
  @ResponseMessage('Find by id')
  findById(@Param('id') id: string) {
    return this.UserActivityService.findById(id);
  }

  @Patch(':id')
  @ResponseMessage('Update by id')
  update(
    @Param('id') id: string,
    @Body() updateUserActivityDto: UpdateUserActivitysDto,
    @User() user: IUser,
  ) {
    return this.UserActivityService.update(id, updateUserActivityDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete by id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.UserActivityService.remove(id, user);
  }
}
