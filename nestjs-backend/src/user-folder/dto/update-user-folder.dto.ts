import { PartialType } from '@nestjs/mapped-types';
import { CreateUserFoldersDto } from './create-user-folder.dto';

export class UpdateUserFoldersDto extends PartialType(CreateUserFoldersDto) {}
