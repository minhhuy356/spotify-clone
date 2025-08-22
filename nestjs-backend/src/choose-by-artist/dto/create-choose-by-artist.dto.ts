import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDate,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IsObjectId } from '@/decorator/is-object-id';

export class CreateChooseByArtistsDto {
  @IsObjectId()
  artist: string;

  @IsString()
  @IsOptional()
  chooseImgUrl?: string;

  @IsOptional()
  @IsString()
  chooseTitle?: string;

  @IsOptional()
  @IsObjectId()
  chooseTrack?: string | null;

  @IsString()
  @IsObjectId()
  chooseAlbum?: string;

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  deletedAt?: Date;
}
