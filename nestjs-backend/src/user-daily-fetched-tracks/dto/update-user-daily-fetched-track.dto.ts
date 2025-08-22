import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDailyFetchedTracksDto } from './create-user-daily-fetched-track.dto';
import { IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserDailyFetchedTracksDto extends PartialType(
  CreateUserDailyFetchedTracksDto,
) {}
