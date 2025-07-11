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
} from '@nestjs/common';

import { Public, ResponseMessage, User } from '@/decorator/customize';
import { IUser } from '@/users/users.interface';
import { CreateTrackArtistsDto } from './dto/create-track-artist.dto';
import { TrackArtistsService } from './track-artist.service';
import { UpdateTrackArtistsDto } from './dto/update-track-artist.dto';

@Controller('track-artists')
export class TrackArtistsController {
  constructor(private readonly TrackArtistService: TrackArtistsService) {}

  @Post()
  @ResponseMessage('Create new Track')
  create(
    @Body() createTrackArtistDto: CreateTrackArtistsDto,
    @User() user: IUser,
  ) {
    return this.TrackArtistService.create(createTrackArtistDto, user);
  }

  @Public()
  @Get()
  @ResponseMessage('Find All')
  findAll(
    @Query('current') current: number,
    @Query('pageSize') pageSize: number,
    @Query() qs: string,
  ) {
    return this.TrackArtistService.findAll(+current, +pageSize, qs);
  }

  @Public()
  @Post('genres-name')
  get(
    @Body()
    body: {
      genres: string[];
      limit: number;
      matchMode?: 'every' | 'some';
    },
  ) {
    return this.TrackArtistService.findByGenresName(body);
  }

  @Public()
  @Get(':id')
  @ResponseMessage('Find by id')
  findById(@Param('id') id: string) {
    return this.TrackArtistService.findById(id);
  }

  @Public()
  @Get('artist/:id')
  @ResponseMessage('Find by id')
  findAllTrackByArtist(
    @Param('id') artistId: string,
    @Query('sortBy') sortBy?: string,
  ) {
    return this.TrackArtistService.findAllTrackByArtist(artistId, sortBy);
  }

  @Public()
  @Get('album/:id')
  @ResponseMessage('Find track by album')
  findAllTrackByAlbum(@Param('id') albumId: string) {
    return this.TrackArtistService.findAllTrackByAlbum(albumId);
  }

  @Patch(':id')
  @ResponseMessage('Update by id')
  update(
    @Param('id') id: string,
    @Body() updateTrackArtistDto: UpdateTrackArtistsDto,
    @User() user: IUser,
  ) {
    return this.TrackArtistService.update(id, updateTrackArtistDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete by id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.TrackArtistService.remove(id, user);
  }

  @Public()
  @Post('tag/:id')
  @ResponseMessage('Fetch track by Tag')
  findAllTrackByTag(
    @Param('id') tagId: string,
    @Query('sortBy') sortBy?: string,
    @Body('takenTracksId') takenTracksId?: string[],
  ) {
    return this.TrackArtistService.findTrackByTag(tagId, sortBy, takenTracksId);
  }
}
