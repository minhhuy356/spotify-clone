import { IsObjectId } from '@/decorator/is-object-id';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateFolderUsersDto {
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsArray()
  @IsOptional()
  playlists?: ObjectId[];

  @IsObjectId()
  @IsOptional()
  user: ObjectId;
}
