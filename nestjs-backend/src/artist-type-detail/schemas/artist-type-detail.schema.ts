import { ArtistTypeGroup } from '@/artist-type-group/schemas/artist-type.schema';
import { User } from '@/users/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';

export type ArtistTypeDetailDocument = HydratedDocument<ArtistTypeDetail>;

@Schema({ timestamps: true })
export class ArtistTypeDetail {
  @Prop({ required: true })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: ArtistTypeGroup.name,
  })
  artistTypeGroup: ObjectId;

  @Prop()
  order?: number;

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

export const ArtistTypeDetailSchema =
  SchemaFactory.createForClass(ArtistTypeDetail);
