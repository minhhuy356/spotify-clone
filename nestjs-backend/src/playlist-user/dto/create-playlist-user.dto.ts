import { IsObjectId } from '@/decorator/is-object-id';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreatePlaylistUsersDto {
  @IsString()
  name: string;

  @IsArray()
  @IsOptional()
  tracks?: ObjectId[];

  @IsObjectId()
  @IsOptional()
  user: ObjectId;

  @IsNumber()
  order: number;
}
