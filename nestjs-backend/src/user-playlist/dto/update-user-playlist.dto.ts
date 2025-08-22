import { PartialType } from '@nestjs/mapped-types';
import { CreateUserPlaylistsDto } from './create-user-playlist.dto';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserPlaylistsDto extends PartialType(
  CreateUserPlaylistsDto,
) {
  @IsDate()
  @IsOptional()
  addLibraryAt?: Date | null;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  pinnedAt?: Date | null;

  @IsString()
  @IsOptional()
  imgUrl?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
