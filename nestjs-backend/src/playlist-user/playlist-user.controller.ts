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
import { PlaylistUsersService } from './playlist-user.service';
import { UpdatePlaylistUsersDto } from './dto/update-playlist-user.dto';
import { CreatePlaylistUsersDto } from './dto/create-playlist-user.dto';

@Controller('playlist-user')
export class PlaylistUsersController {
  constructor(private readonly PlaylistUserService: PlaylistUsersService) {}

  @Post()
  @ResponseMessage('Create new PlaylistUser')
  create(@Body() createPlaylistUserDto: CreatePlaylistUsersDto) {
    return this.PlaylistUserService.create(createPlaylistUserDto);
  }

  @Public()
  @Get()
  @ResponseMessage('Find All')
  findAll(
    @Query('current') current: number,
    @Query('pageSize') pageSize: number,
    @Query() qs: string,
  ) {
    return this.PlaylistUserService.findAll(+current, +pageSize, qs);
  }

  @Public()
  @Get(':id')
  @ResponseMessage('Find by id')
  findById(@Param('id') id: string) {
    return this.PlaylistUserService.findById(id);
  }

  @Patch(':id')
  @ResponseMessage('Update by id')
  update(
    @Param('id') id: string,
    @Body() updatePlaylistUserDto: UpdatePlaylistUsersDto,
    @User() user: IUser,
  ) {
    return this.PlaylistUserService.update(id, updatePlaylistUserDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete by id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.PlaylistUserService.remove(id, user);
  }
}
