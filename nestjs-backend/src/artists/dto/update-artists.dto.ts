import { PartialType } from '@nestjs/mapped-types';
import { CreateArtistsDto } from './create-artists.dto';

export class UpdateArtistsDto extends PartialType(CreateArtistsDto) {}
