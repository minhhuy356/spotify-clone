import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';

export type UserTypeDocument = HydratedDocument<UserType>;

@Schema({ timestamps: true })
export class UserType {
  @Prop({ default: '' })
  name: string;
}

export const UserTypeSchema = SchemaFactory.createForClass(UserType);
