import {
  IsArray,
  IsMongoId,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import mongoose, { ObjectId } from 'mongoose';

export class CreateUserActivitysDto {
  @IsMongoId()
  @IsOptional()
  track?: mongoose.Schema.Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  artist?: mongoose.Schema.Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  albums?: mongoose.Schema.Types.ObjectId;

  @IsMongoId()
  user: mongoose.Schema.Types.ObjectId | string;

  @IsNumber()
  @IsOptional()
  quantity?: number;
}
