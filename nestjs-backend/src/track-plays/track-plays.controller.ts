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
import { TrackPlaysService } from './track-plays.service';
import { UpdateTrackPlaysDto } from './dto/update-track-play.dto';
import { CreateTrackPlaysDto } from './dto/create-track-play.dto';

@Controller('TrackPlays')
export class TrackPlaysController {
  constructor(private readonly TrackPlayService: TrackPlaysService) {}
}
