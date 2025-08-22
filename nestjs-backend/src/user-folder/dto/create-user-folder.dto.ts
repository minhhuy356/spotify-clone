import { IsObjectId } from '@/decorator/is-object-id';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateUserFoldersDto {
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsObjectId()
  @IsOptional()
  user?: ObjectId;
}
