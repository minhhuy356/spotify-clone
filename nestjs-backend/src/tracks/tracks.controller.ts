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
  NotFoundException,
  Req,
} from '@nestjs/common';

import { Public, ResponseMessage, User } from '@/decorator/customize';
import { IUser } from '@/users/users.interface';
import { TracksService } from './tracks.service';
import { CreateTracksDto } from './dto/create-track.dto';
import { UpdateTracksDto } from './dto/update-track.dto';
import { join } from 'path';
import { createReadStream, existsSync, statSync } from 'fs';
import { Response, Request } from 'express';

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
  @Post('genres-name')
  getTop(@Body() body: { genres: string[]; limit: number }) {
    return this.trackService.findTrackByNameGenres(body);
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
  @Get('stream/audio/:filename')
  @Public()
  streamAudio(
    @Param('filename') filename: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const filePath = join(
      __dirname,
      '..',
      '..',
      'public',
      'tracks',
      'audios',
      filename,
    );

    if (!existsSync(filePath)) {
      throw new NotFoundException('Audio file not found');
    }

    const stat = statSync(filePath);
    const fileSize = stat.size;
    const range =
      typeof req.headers.range === 'string' ? req.headers.range : undefined;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize || end >= fileSize) {
        res.status(416).send('Requested range not satisfiable');
        return;
      }

      const chunkSize = end - start + 1;
      const file = createReadStream(filePath, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'inline',
        'Cache-Control': 'no-store',
      });

      file.pipe(res);
    } else {
      // Không có header Range → trả cả file
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'audio/mpeg',
        'Accept-Ranges': 'bytes',
        'Content-Disposition': 'inline',
        'Cache-Control': 'no-store',
      });

      createReadStream(filePath).pipe(res);
    }
  }
  // @Public()
  // @Get('album/:id')
  // fetchTrackByAlbum(@Param('id', new ParseUUIDPipe()) id: string) {
  //   return this.trackService.fetchTrackByAlbum(id);
  // }
}
