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
import { ListeningHistorysService } from './listening-historys.service';
import { UpdateListeningHistorysDto } from './dto/update-listening-history.dto';
import { CreateListeningHistorysDto } from './dto/create-listening-history.dto';

@Controller('listening-historys')
export class ListeningHistorysController {
  constructor(
    private readonly ListeningHistorysService: ListeningHistorysService,
  ) {}
  @Public()
  @Post('trending')
  async getTrendingTracks(
    @Body()
    body: {
      releasedBy: string;
      dateLimit?: number | string;
      limit?: number | string;
    },
  ) {
    const { releasedBy } = body;
    const dateLimit = parseInt(body.dateLimit as any) || 28;
    const limit = parseInt(body.limit as any) || 20;

    return this.ListeningHistorysService.getTrendingTracksByReleasedBy(
      releasedBy,
      dateLimit,
      limit,
    );
  }

  @Get('recently')
  async getAlbumRecently(@User() user: IUser) {
    return this.ListeningHistorysService.getRecently(user);
  }
}
