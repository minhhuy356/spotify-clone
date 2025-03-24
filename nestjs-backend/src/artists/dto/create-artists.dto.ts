import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDate,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateArtistsDto {
  @IsString()
  @IsNotEmpty()
  stageName: string;

  @IsString()
  @IsOptional()
  realName: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Transform(({ value }) => new Date(value))
  date?: Date;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  profileImgUrl?: string;

  @IsOptional()
  @IsString()
  avatarImgUrl?: string;

  @IsOptional()
  @IsString()
  coverImgUrl?: string;

  @IsOptional()
  @IsNumber()
  countLike?: number;

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  deletedAt?: Date;
}
