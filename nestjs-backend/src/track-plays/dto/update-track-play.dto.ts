import { PartialType } from '@nestjs/mapped-types';
import { CreateTrackPlaysDto } from './create-track-play.dto';

export class UpdateTrackPlaysDto extends PartialType(CreateTrackPlaysDto) {}
