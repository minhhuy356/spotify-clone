import { IsObjectId } from '@/decorator/is-object-id';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateListeningHistorysDto {
  @IsObjectId()
  @IsOptional()
  user: ObjectId;

  @IsObjectId()
  @IsOptional()
  track?: ObjectId;

  @IsObjectId()
  @IsOptional()
  album?: ObjectId;

  @IsObjectId()
  @IsOptional()
  artist?: ObjectId;
}
