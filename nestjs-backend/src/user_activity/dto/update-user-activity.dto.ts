import { PartialType } from '@nestjs/mapped-types';
import { CreateUserActivitysDto } from './create-user-activity.dto';

export class UpdateUserActivitysDto extends PartialType(
  CreateUserActivitysDto,
) {}
