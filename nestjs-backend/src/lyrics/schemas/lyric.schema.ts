import { Track } from '@/tracks/schemas/track.schemas';
import { User } from '@/users/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';

export type LyricDocument = HydratedDocument<Lyric>;

interface ILines {
  startTime: number;
  text: string;
}

interface ILines {
  startTime: number;
  text: string;
}

@Schema({ timestamps: true })
export class Lyric {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: Track.name,
  })
  track: ObjectId;

  @Prop({ required: true })
  language: string;

  @Prop({ required: true })
  synced: boolean;

  @Prop({
    type: [
      {
        startTime: { type: Number, required: true },
        text: { type: String, required: true },
      },
    ],
    required: true,
  })
  lines: ILines[]; // <- đây mới đúng

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;
}

export const LyricSchema = SchemaFactory.createForClass(Lyric);
