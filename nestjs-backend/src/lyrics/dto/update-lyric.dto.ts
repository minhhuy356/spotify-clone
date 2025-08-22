import { PartialType } from '@nestjs/mapped-types';
import { CreateLyricsDto } from './create-Lyric.dto';

export class UpdateLyricsDto extends PartialType(CreateLyricsDto) {}
