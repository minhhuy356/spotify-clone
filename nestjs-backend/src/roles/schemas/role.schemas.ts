import { User } from '@/users/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true })
export class Role {
  @Prop()
  name: string;

  // @Prop({
  //   type: mongoose.Schema.Types.ObjectId,
  // })
  // createdBy: ObjectId;

  // @Prop({
  //   type: mongoose.Schema.Types.ObjectId,
  // })
  // updatedBy: ObjectId;

  // @Prop({
  //   type: mongoose.Schema.Types.ObjectId,
  // })
  // deletedBy: ObjectId;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
