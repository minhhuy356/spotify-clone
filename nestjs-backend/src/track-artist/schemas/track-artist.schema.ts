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
  track: ObjectId; // ID của bài hát

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Artist.name,
    required: true,
  })
  artist: ObjectId; // ID nghệ sĩ

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: ArtistTypeDetail.name,
    required: true,
  })
  artistTypeDetail: ObjectId; // Danh sách vai trò

  @Prop({ default: false })
  useStageName: boolean; // Dùng tên nghệ danh hay không

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
