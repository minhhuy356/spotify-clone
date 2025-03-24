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
  chooseImgUrl?: string;

  @IsOptional()
  @IsString()
  chooseTitle: string;

  @IsObjectId()
  chooseTrack?: string;

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  deletedAt?: Date;
}
