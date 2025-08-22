import { PartialType } from '@nestjs/mapped-types';
import { CreateArtistTypeDetailsDto } from './create-artist-type-detail.dto';

export class UpdateArtistTypeDetailsDto extends PartialType(
  CreateArtistTypeDetailsDto,
) {}
