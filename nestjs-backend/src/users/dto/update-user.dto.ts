import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsDate } from 'class-validator';
import { Prop } from '@nestjs/mongoose';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
