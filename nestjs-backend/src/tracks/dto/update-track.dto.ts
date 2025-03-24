import { PartialType } from '@nestjs/mapped-types';
import { CreateTracksDto } from './create-track.dto';
import { IsBoolean, IsMongoId, IsOptional } from 'class-validator';
import { ObjectId } from 'mongoose';

export class UpdateTracksDto extends PartialType(CreateTracksDto) {}
