import { Track } from '@/tracks/schemas/track.schemas';
import { User } from '@/users/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId, Types } from 'mongoose';

export type UserDailyFetchedTrackDocument =
  HydratedDocument<UserDailyFetchedTrack>;

@Schema({ timestamps: true })
export class UserDailyFetchedTrack {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Track.name,
  })
  track: ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    default: '',
  })
  user?: ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  deletedBy: ObjectId;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;
}

export const UserDailyFetchedTrackSchema = SchemaFactory.createForClass(
  UserDailyFetchedTrack,
);
