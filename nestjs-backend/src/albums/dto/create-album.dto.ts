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

  @IsArray()
  @IsOptional()
  track: ObjectId[];

  @IsObjectId()
  @IsOptional()
  user: ObjectId;

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
