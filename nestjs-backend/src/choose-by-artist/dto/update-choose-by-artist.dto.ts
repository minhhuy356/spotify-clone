import { PartialType } from '@nestjs/mapped-types';
import { CreateChooseByArtistsDto } from './create-choose-by-artist.dto';

export class UpdateChooseByArtistsDto extends PartialType(
  CreateChooseByArtistsDto,
) {}
