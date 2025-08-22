import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsDate,
  IsBoolean,
  IsOptional,
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
} from 'class-validator';
import { Gender } from '../users.enum';
import { ObjectId } from 'mongoose';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsDate()
  @IsOptional()
  date?: Date;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsEnum(Gender, {
    message:
      'Gender must be one of the following: male, female, non-binary, other',
  })
  @IsOptional()
  gender?: Gender;

  @IsString()
  @IsOptional()
  imgUrl?: string;

  @IsString()
  @IsOptional()
  provider?: string;

  @IsMongoId()
  @IsOptional()
  accountType?: ObjectId;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  roles?: ObjectId[];

  @IsBoolean()
  @IsOptional()
  isVerify?: boolean;

  @IsString()
  @IsOptional()
  refresh_token?: string;
}
