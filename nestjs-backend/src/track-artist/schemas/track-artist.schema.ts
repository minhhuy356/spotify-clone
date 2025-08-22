import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';

import { Artist } from '@/artists/schemas/artist.schema';
import { Track } from '@/tracks/schemas/track.schemas';
import { ArtistTypeDetail } from '@/artist-type-detail/schemas/artist-type-detail.schema';
import { User } from '@/users/schemas/user.schema';

export type TrackArtistDocument = HydratedDocument<TrackArtist>;

@Schema({ timestamps: true })
export class TrackArtist {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Track.name,
    required: true,
  })
  track: ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Artist.name,
    required: true,
  })
  artist: ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: ArtistTypeDetail.name,
    required: true,
  })
  artistTypeDetail: ObjectId;

  @Prop({ default: false })
  useStageName: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
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

export const TrackArtistSchema = SchemaFactory.createForClass(TrackArtist);
