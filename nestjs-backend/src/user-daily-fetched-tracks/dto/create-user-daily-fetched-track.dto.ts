import { IsObjectId, IsObjectIdConstraint } from '@/decorator/is-object-id';
import { IsStringToObjectId } from '@/decorator/isObjectId';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsOptional, IsString } from 'class-validator';
import { ObjectId, Types } from 'mongoose';

export class CreateUserDailyFetchedTracksDto {
  @IsStringToObjectId()
  track: string;

  @IsObjectId()
  @IsOptional()
  user?: ObjectId;
}
