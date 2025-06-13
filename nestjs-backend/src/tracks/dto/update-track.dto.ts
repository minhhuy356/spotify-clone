import { PartialType } from '@nestjs/mapped-types';
import { CreateTracksDto } from './create-track.dto';
import { IsBoolean, IsDate, IsMongoId, IsOptional } from 'class-validator';
import { ObjectId } from 'mongoose';
import { Type } from 'class-transformer';

export class UpdateTracksDto extends PartialType(CreateTracksDto) {
  @IsDate()
  @IsOptional()
  addLibraryAt?: Date | null;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  pinnedAt?: Date | null;
}
