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
import { IUser } from '@/users/users.interface';

import { UserPlaylist } from './schemas/user-playlist.schema';
import { CreateUserPlaylistsDto } from './dto/create-user-playlist.dto';
import { UpdateUserPlaylistsDto } from './dto/update-user-playlist.dto';
import { UserPlaylistsService } from './user-playlist.service';

@Controller('user-playlist')
export class UserPlaylistsController {
  constructor(private readonly userPlaylistService: UserPlaylistsService) {}

  @Post()
  @ResponseMessage('Create new UserPlaylist')
  create(
    @Body() createUserPlaylistDto: CreateUserPlaylistsDto,
    @User() user: IUser,
  ) {
    return this.userPlaylistService.create(createUserPlaylistDto, user);
  }

  @Public()
  @Get()
  @ResponseMessage('Find All')
  findAll(
    @Query('current') current: number,
    @Query('pageSize') pageSize: number,
    @Query() qs: string,
  ) {
    return this.userPlaylistService.findAll(+current, +pageSize, qs);
  }

  @Public()
  @Get(':id')
  @ResponseMessage('Find by id')
  findById(@Param('id') id: string) {
    return this.userPlaylistService.findById(id);
  }

  @Patch(':id')
  @ResponseMessage('Update by id')
  update(
    @Param('id') id: string,
    @Body() updateUserPlaylistDto: UpdateUserPlaylistsDto,
    @User() user: IUser,
  ) {
    return this.userPlaylistService.update(id, updateUserPlaylistDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete by id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.userPlaylistService.remove(id, user);
  }
}
