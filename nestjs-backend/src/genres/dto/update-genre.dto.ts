import { PartialType } from '@nestjs/mapped-types';
import { CreateGenresDto } from './create-genre.dto';

export class UpdateGenresDto extends PartialType(CreateGenresDto) {}
