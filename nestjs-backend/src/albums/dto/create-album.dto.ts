import { IsObjectId } from '@/decorator/is-object-id';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateAlbumsDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  imgUrl: string;

  @IsObjectId()
  @IsOptional()
  releasedBy: ObjectId;

  @IsNumber()
  @IsOptional()
  countLike: number;

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  deletedAt?: Date;
}
