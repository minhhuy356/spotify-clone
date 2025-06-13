import { PartialType } from '@nestjs/mapped-types';
import { CreateUserFoldersDto } from './create-user-folder.dto';
import { IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserFoldersDto extends PartialType(CreateUserFoldersDto) {
  @IsDate()
  @IsOptional()
  addLibraryAt?: Date | null;
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  pinnedAt?: Date | null;
}
