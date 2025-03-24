import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpException,
  Res,
  ParseUUIDPipe,
} from '@nestjs/common';

import { Public, ResponseMessage, User } from '@/decorator/customize';
import { IUser } from '@/users/users.interface';
import { TracksService } from './tracks.service';
import { CreateTracksDto } from './dto/create-track.dto';
import { UpdateTracksDto } from './dto/update-track.dto';
import { join } from 'path';
import { createReadStream } from 'fs';

@Controller('tracks')
export class TracksController {
  constructor(private readonly trackService: TracksService) {}

  @Post()
  @ResponseMessage('Create new Track')
  create(@Body() createTrackDto: CreateTracksDto, @User() user: IUser) {
    return this.trackService.create(createTrackDto, user);
  }

  @Public()
  @Get()
  @ResponseMessage('Find All')
  findAll(
    @Query('current') current: number,
    @Query('pageSize') pageSize: number,
    @Query() qs: string,
  ) {
    return this.trackService.findAll(+current, +pageSize, qs);
  }

  @Public()
  @Post('top')
  getTop(@Body() body: { genres: string[]; limit: number }) {
    return this.trackService.findTrackByGenres(body);
  }

  @Public()
  @Post('increase-view')
  increaseView(@Body() body: { trackId: string; userId: string }) {
    return this.trackService.increaseView(body);
  }

  @Public()
  @Get(':id')
  findById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.trackService.findById(id);
  }

  @Patch(':id')
  @ResponseMessage('Update by id')
  update(
    @Param('id') id: string,
    @Body() updateTrackDto: UpdateTracksDto,
    @User() user: IUser,
  ) {
    return this.trackService.update(id, updateTrackDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete by id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.trackService.remove(id, user);
  }

  @Public()
  @Get('stream/audio/:filename')
  streamAudio(@Param('filename') filename: string, @Res() res: any) {
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'inline'); // Không cho phép tải xuống
    res.setHeader('Cache-Control', 'no-store');

    const filePath = join(
      __dirname,
      '..',
      '..',
      'public',
      'tracks',
      'audios',
      filename,
    );
    console.log(filePath);
    const stream = createReadStream(filePath);
    stream.pipe(res);
  }
}
