import { Artist } from '@/artists/schemas/artist.schema';
import { Track } from '@/tracks/schemas/track.schemas';
import { User } from '@/users/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';

export type ChooseByArtistDocument = HydratedDocument<ChooseByArtist>;

@Schema({ timestamps: true })
export class ChooseByArtist {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Artist.name,
    required: true,
  })
  artist: string;

  @Prop({})
  chooseImgUrl: string;

  @Prop({ default: '' })
  chooseTitle?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Track.name,
  })
  chooseTrack: ObjectId;

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

export const ChooseByArtistSchema =
  SchemaFactory.createForClass(ChooseByArtist);
