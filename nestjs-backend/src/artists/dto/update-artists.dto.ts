import { PartialType } from '@nestjs/mapped-types';
import { CreateArtistsDto } from './create-artists.dto';
import { IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateArtistsDto extends PartialType(CreateArtistsDto) {
  @IsDate()
  @IsOptional()
  addLibraryAt?: Date | null;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  pinnedAt?: Date | null;
}
