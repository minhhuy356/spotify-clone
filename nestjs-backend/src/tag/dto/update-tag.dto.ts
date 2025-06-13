import { PartialType } from '@nestjs/mapped-types';
import { CreateTagsDto } from './create-Tag.dto';

export class UpdateTagsDto extends PartialType(CreateTagsDto) {}
