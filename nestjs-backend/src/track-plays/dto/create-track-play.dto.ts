import { IsObjectId } from '@/decorator/is-object-id';
import { IsDate, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateTrackPlaysDto {
  @IsObjectId()
  user: ObjectId;

  @IsObjectId()
  track: ObjectId;
}
