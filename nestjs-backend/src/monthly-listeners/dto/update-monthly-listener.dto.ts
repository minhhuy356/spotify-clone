import { PartialType } from '@nestjs/mapped-types';
import { CreateMonthlyListenersDto } from './create-monthly-listener.dto';

export class UpdateMonthlyListenersDto extends PartialType(
  CreateMonthlyListenersDto,
) {}
