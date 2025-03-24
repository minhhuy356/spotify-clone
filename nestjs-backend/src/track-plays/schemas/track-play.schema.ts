import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';
import { User } from '@/users/schemas/user.schema';
import { Track } from '@/tracks/schemas/track.schemas';

export type TrackPlayDocument = HydratedDocument<TrackPlay>;

@Schema({ timestamps: true }) // Tự động tạo createdAt (thời gian nghe)
export class TrackPlay {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user: ObjectId; // ID người nghe

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Track.name,
    required: true,
  })
  track: ObjectId; // ID bài hát

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;
}

export const TrackPlaySchema = SchemaFactory.createForClass(TrackPlay);
