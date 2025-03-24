import { Album } from '@/albums/schemas/Album.schema';
import { Artist } from '@/artists/schemas/artist.schema';

import { Track } from '@/tracks/schemas/track.schemas';
import { User } from '@/users/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId, Types } from 'mongoose';

export type UserActivityDocument = HydratedDocument<UserActivity>;

@Schema({ timestamps: true })
export class UserActivity {
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: Track.name,
  })
  tracks: ObjectId[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: Artist.name,
  })
  artists: ObjectId[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: Album.name,
  })
  albums: ObjectId[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User.name,
  })
  user: ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  createdBy: ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  updatedBy: ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  deletedBy: ObjectId;

  @Prop()
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;
}

export const UserActivitySchema = SchemaFactory.createForClass(UserActivity);
