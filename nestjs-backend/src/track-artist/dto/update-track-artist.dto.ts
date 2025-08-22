import { PartialType } from '@nestjs/mapped-types';
import { CreateTrackArtistsDto } from './create-track-artist.dto';

export class UpdateTrackArtistsDto extends PartialType(CreateTrackArtistsDto) {}
