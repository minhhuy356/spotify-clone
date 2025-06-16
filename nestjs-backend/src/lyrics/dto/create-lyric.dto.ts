import {
  IsBoolean,
  IsMongoId,
  IsOptional,
  IsString,
  ValidateNested,
  IsArray,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ObjectId } from 'mongoose';

class LineDto {
  @IsNumber()
  startTime: number;

  @IsString()
  text: string;
}

export class CreateLyricsDto {
  @IsOptional()
  @IsMongoId()
  track: ObjectId;

  @IsString()
  language: string;

  @IsBoolean()
  synced: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LineDto)
  lines: LineDto[];
}
