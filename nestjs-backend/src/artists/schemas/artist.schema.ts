import { Track } from '@/tracks/schemas/track.schemas';
import { User } from '@/users/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';

export type ArtistDocument = HydratedDocument<Artist>;

@Schema({ timestamps: true })
export class Artist {
  @Prop({ required: true })
  stageName: string;

  @Prop({ default: '' })
  realName: string;

  @Prop({ default: '' })
  date: Date;

  @Prop({ default: '' })
  country: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: '' })
  profileImgUrl: string;

  @Prop({ default: '' })
  avatarImgUrl: string;

  @Prop({ default: '' })
  coverImgUrl: string;

  @Prop({ default: 0 })
  countLike: number;

  @Prop({ default: null })
  addLibraryAt: Date;
  @Prop({ default: null })
  pinnedAt: Date;

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

  @Prop({ default: null })
  deletedAt: Date;
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);
