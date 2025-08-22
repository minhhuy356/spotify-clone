import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';
import { User } from '@/users/schemas/user.schema';
import { Track } from '@/tracks/schemas/track.schemas';
import { Album } from '@/albums/schemas/Album.schema';
import { Artist } from '@/artists/schemas/artist.schema';

export type ListeningHistoryDocument = HydratedDocument<ListeningHistory>;

@Schema({ timestamps: true })
export class ListeningHistory {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user: ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Track.name,
  })
  track: ObjectId | null;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Album.name,
  })
  album: ObjectId | null;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Artist.name,
  })
  artist: ObjectId | null;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;
}

export const ListeningHistorySchema =
  SchemaFactory.createForClass(ListeningHistory);
