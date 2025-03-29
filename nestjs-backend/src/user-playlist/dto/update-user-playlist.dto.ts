import { PartialType } from '@nestjs/mapped-types';
import { CreateUserPlaylistsDto } from './create-user-playlist.dto';

export class UpdateUserPlaylistsDto extends PartialType(
  CreateUserPlaylistsDto,
) {}
