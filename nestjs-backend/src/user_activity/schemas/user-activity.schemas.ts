import { Album } from '@/albums/schemas/Album.schema';
import { Artist } from '@/artists/schemas/artist.schema';

import { Track } from '@/tracks/schemas/track.schemas';
import { ITrack } from '@/types/data';
import { UserFolder } from '@/user-folder/schemas/user-folder.schema';
import { UserPlaylist } from '@/user-playlist/schemas/user-playlist.schema';
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
  tracks: Types.ObjectId[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: Artist.name,
  })
  artists: Types.ObjectId[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: Album.name,
  })
  albums: Types.ObjectId[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: UserPlaylist.name,
    default: [],
  })
  playlists: Types.ObjectId[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: UserFolder.name,
    default: [],
  })
  folders: Types.ObjectId[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    default: '',
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
