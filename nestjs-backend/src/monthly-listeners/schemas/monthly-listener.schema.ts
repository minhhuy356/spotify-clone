import { Artist } from '@/artists/schemas/artist.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';

export type MonthlyListenerDocument = HydratedDocument<MonthlyListener>;

@Schema({ timestamps: true })
export class MonthlyListener {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Artist.name,
    required: true,
  })
  artist: ObjectId; // Nghệ sĩ

  @Prop({ type: Number, default: 0 })
  listenersCount: number; // Số lượng người nghe duy nhất trong 28 ngày

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;
}

export const MonthlyListenerSchema =
  SchemaFactory.createForClass(MonthlyListener);
