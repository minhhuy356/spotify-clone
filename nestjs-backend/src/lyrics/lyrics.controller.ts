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
import { LyricsService } from './lyrics.service';
import { UpdateLyricsDto } from './dto/update-Lyric.dto';
import { CreateLyricsDto } from './dto/create-Lyric.dto';

@Controller('lyrics')
export class LyricsController {
  constructor(private readonly LyricService: LyricsService) {}

  @Post()
  @ResponseMessage('Create new Lyric')
  create(@Body() createLyricDto: CreateLyricsDto) {
    return this.LyricService.create(createLyricDto);
  }

  @Public()
  @Get()
  @ResponseMessage('Find All')
  findAll(
    @Query('current') current: number,
    @Query('pageSize') pageSize: number,
    @Query() qs: string,
  ) {
    return this.LyricService.findAll(+current, +pageSize, qs);
  }

  @Public()
  @Get(':id')
  @ResponseMessage('Find by id')
  findById(@Param('id') id: string) {
    return this.LyricService.findById(id);
  }

  @Patch(':id')
  @ResponseMessage('Update by id')
  update(
    @Param('id') id: string,
    @Body() updateLyricDto: UpdateLyricsDto,
    @User() user: IUser,
  ) {
    return this.LyricService.update(id, updateLyricDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete by id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.LyricService.remove(id, user);
  }
}
