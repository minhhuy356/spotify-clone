import { PartialType } from '@nestjs/mapped-types';
import { CreateAlbumsDto } from './create-album.dto';
import { IsDate, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAlbumsDto extends PartialType(CreateAlbumsDto) {
  @IsDate()
  @IsOptional()
  addLibraryAt?: Date | null;
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  pinnedAt?: Date | null;

  @IsEnum(['album', 'ep', 'single'], {
    message: 'type must be one of: album, ep, single',
  })
  @IsOptional()
  type?: 'album' | 'ep' | 'single';
}
