import { Artist } from '@/artists/schemas/artist.schema';
import { Track } from '@/tracks/schemas/track.schemas';
import { User } from '@/users/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';

export type AlbumDocument = HydratedDocument<Album>;

@Schema({ timestamps: true })
export class Album {
  @Prop({ required: true })
  name: string;

  @Prop({ default: 0 })
  countLike: number;

  @Prop({ required: true })
  imgUrl: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Artist.name })
  releasedBy: ObjectId;

  @Prop({ default: null })
  addLibraryAt: Date;

  @Prop({ default: null })
  pinnedAt: Date;

  @Prop({ default: '', required: false })
  copyrightNotice: string;

  @Prop({ default: '', required: false })
  phonogramCopyright: string;

  @Prop({
    type: String,
    enum: ['album', 'ep', 'single'],
    default: 'single',
  })
  type: 'album' | 'ep' | 'single';

  @Prop({
    default: 0,
    min: 0,
    max: 100,
  })
  score: number;

  @Prop({
    default: 0,
  })
  totalTracks: number;

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

export const AlbumSchema = SchemaFactory.createForClass(Album);
