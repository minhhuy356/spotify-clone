import { PartialType } from '@nestjs/mapped-types';
import { CreateFolderUsersDto } from './create-Folder-user.dto';

export class UpdateFolderUsersDto extends PartialType(CreateFolderUsersDto) {}
