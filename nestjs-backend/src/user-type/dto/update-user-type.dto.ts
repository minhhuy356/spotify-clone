import { PartialType } from '@nestjs/mapped-types';
import { CreateUserTypesDto } from './create-user-type.dto';

export class UpdateUserTypesDto extends PartialType(CreateUserTypesDto) {}
