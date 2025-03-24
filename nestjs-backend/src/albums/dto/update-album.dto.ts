import { PartialType } from '@nestjs/mapped-types';
import { CreateAlbumsDto } from './create-album.dto';

export class UpdateAlbumsDto extends PartialType(CreateAlbumsDto) {}
