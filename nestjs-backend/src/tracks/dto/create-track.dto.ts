import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsMongoId,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ObjectId } from 'mongoose';

// Định nghĩa kiểu dữ liệu cho nghệ sĩ trong track

export class CreateTracksDto {
  @IsString()
  title: string;

  @IsMongoId()
  releasedBy: ObjectId;

  @IsString()
  audioUrl: string;

  @IsString()
  @IsOptional()
  videoUrl: string;

  @IsOptional()
  @IsMongoId()
  user: ObjectId;

  @IsArray()
  @IsMongoId({ each: true })
  genres: ObjectId[];

  @IsString()
  @IsOptional()
  imgUrl: string;

  @IsNumber()
  @IsOptional()
  countLike: number;

  @IsNumber()
  @IsOptional()
  countPlay: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Transform(({ value }) => new Date(value))
  releaseDay: Date;

  @IsMongoId({ each: true })
  @IsOptional()
  album: ObjectId;

  @IsNumber()
  @IsOptional()
  order: number | null;
}
