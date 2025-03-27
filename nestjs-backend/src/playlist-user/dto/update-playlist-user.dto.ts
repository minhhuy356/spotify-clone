import { PartialType } from '@nestjs/mapped-types';
import { CreatePlaylistUsersDto } from './create-playlist-user.dto';

export class UpdatePlaylistUsersDto extends PartialType(
  CreatePlaylistUsersDto,
) {}
