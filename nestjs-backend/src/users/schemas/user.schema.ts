import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';
import { Gender } from '../users.enum';
import { Role } from '@/roles/schemas/role.schemas';
import { UserType } from '@/user-type/schemas/user-type.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: '' })
  name: string;

  @Prop({ default: '' })
  date: Date;

  @Prop({ default: '' })
  address: string;

  @Prop({ default: '' })
  phoneNumber: string;

  @Prop({ default: '' })
  country: string;

  @Prop({ type: String, enum: Gender, default: Gender.Other })
  gender: string;

  @Prop({ default: 'SYSTEM' })
  provider: string;

  @Prop({ default: null })
  imgUrl: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: UserType.name,
  })
  accountType: ObjectId;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: Role.name,
  })
  roles: ObjectId[];

  @Prop({ default: false })
  isVerify: boolean;

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

  @Prop()
  refresh_token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
