import { PartialType } from '@nestjs/mapped-types';
import { CreateAlbumsDto } from './create-album.dto';
import { IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAlbumsDto extends PartialType(CreateAlbumsDto) {
  @IsDate()
  @IsOptional()
  addLibraryAt?: Date | null;
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  pinnedAt?: Date | null;
}
