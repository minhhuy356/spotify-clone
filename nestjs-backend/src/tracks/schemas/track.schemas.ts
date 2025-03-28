import { Album } from '@/albums/schemas/Album.schema';
import { Artist } from '@/artists/schemas/artist.schema';
import { Genre } from '@/genres/schemas/genre.schema';

import { User } from '@/users/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId, Types } from 'mongoose';

export type TrackDocument = HydratedDocument<Track>;

@Schema({ timestamps: true })
export class Track {
  @Prop({ required: true })
  title: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: Artist.name,
  })
  releasedBy: ObjectId;

  @Prop({ required: true })
  audioUrl: string;

  @Prop({ default: '' })
  videoUrl: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: Genre.name,
  })
  genres: ObjectId[];

  @Prop({ default: '' })
  imgUrl: string;

  @Prop({ default: 0 })
  countLike: number;

  @Prop({ default: 0 })
  countPlay: number;

  @Prop({ required: true })
  releaseDay: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Album.name,
    default: null,
  })
  album: ObjectId | null;

  @Prop({ default: null })
  order: number | null;

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

export const TrackSchema = SchemaFactory.createForClass(Track);
