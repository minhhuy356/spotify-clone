import { PartialType } from '@nestjs/mapped-types';
import { CreateArtistTypeGroupsDto } from './create-artist-type.dto';

export class UpdateArtistTypeGroupsDto extends PartialType(
  CreateArtistTypeGroupsDto,
) {}
