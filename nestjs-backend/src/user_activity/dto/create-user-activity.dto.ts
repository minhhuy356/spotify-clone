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
  album?: mongoose.Schema.Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  playlist?: mongoose.Schema.Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  folder?: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  user?: mongoose.Schema.Types.ObjectId;

  @IsNumber()
  @IsOptional()
  quantity?: number;
}
