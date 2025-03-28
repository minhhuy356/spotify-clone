import { Album } from '@/albums/schemas/Album.schema';
import { Artist } from '@/artists/schemas/artist.schema';
import { Genre } from '@/genres/schemas/genre.schema';
import { Track } from '@/tracks/schemas/track.schemas';

import { User } from '@/users/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId, Types } from 'mongoose';

export type PlaylistUserDocument = HydratedDocument<PlaylistUser>;

@Schema({ timestamps: true })
export class PlaylistUser {
  @Prop({ required: true })
  name: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: Track.name,
  })
  tracks: ObjectId[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User.name,
  })
  user: ObjectId;

  @Prop({ default: null })
  order: number;

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

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;
}

export const PlaylistUserSchema = SchemaFactory.createForClass(PlaylistUser);
