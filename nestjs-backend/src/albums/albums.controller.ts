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
import { AlbumsService } from './Albums.service';
import { CreateAlbumsDto } from './dto/create-album.dto';
import { UpdateAlbumsDto } from './dto/update-album.dto';
import { AlbumQueryDto } from './dto/query-album.dto';

@Controller('Albums')
export class AlbumsController {
  constructor(private readonly AlbumService: AlbumsService) {}

  @Post()
  @ResponseMessage('Create new Album')
  create(@Body() createAlbumDto: CreateAlbumsDto, @User() user: IUser) {
    return this.AlbumService.create(createAlbumDto, user);
  }

  @Public()
  @Get()
  @ResponseMessage('Find All')
  findAll(
    @Query('current') current: number,
    @Query('pageSize') pageSize: number,
    @Query() qs: string,
  ) {
    return this.AlbumService.findAll(+current, +pageSize, qs);
  }

  @Public()
  @Get(':id')
  @ResponseMessage('Find by id')
  findById(@Param('id') id: string) {
    return this.AlbumService.findById(id);
  }

  @Public()
  @Get('related/:id')
  @ResponseMessage('Find by id')
  fetchAlbumRelated(@Param('id') id: string, @Query() query: AlbumQueryDto) {
    return this.AlbumService.fetchAlbumRelated(id, {
      ...query,
      limit: query.limit ? parseInt(query.limit) : undefined,
      skip: query.skip ? parseInt(query.skip) : undefined,
    });
  }

  @Patch(':id')
  @ResponseMessage('Update by id')
  update(
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumsDto,
    @User() user: IUser,
  ) {
    return this.AlbumService.update(id, updateAlbumDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete by id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.AlbumService.remove(id, user);
  }
}
