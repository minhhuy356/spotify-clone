import { IsObjectId } from '@/decorator/is-object-id';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateUserPlaylistsDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  imgUrl: string;

  @IsArray()
  @IsOptional()
  tracks?: ObjectId[];

  @IsObjectId()
  @IsOptional()
  user?: ObjectId;

  @IsObjectId()
  @IsOptional()
  folder?: ObjectId;

  @IsNumber()
  @IsOptional()
  order: number | null;
}
