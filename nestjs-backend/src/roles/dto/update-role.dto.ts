import { PartialType } from '@nestjs/mapped-types';
import { CreateRolesDto } from './create-role.dto';

export class UpdateRolesDto extends PartialType(CreateRolesDto) {}
