import { PartialType } from '@nestjs/mapped-types';
import { CreateListeningHistorysDto } from './create-listening-history.dto';

export class UpdateListeningHistorysDto extends PartialType(
  CreateListeningHistorysDto,
) {}
