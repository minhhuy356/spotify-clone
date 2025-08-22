import { Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumberString,
  IsBoolean,
  IsBooleanString,
  IsNumber,
  Min,
  Max,
  IsInt,
  IsArray,
} from 'class-validator';

export class AlbumQueryDto {
  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsString()
  select?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number;

  @IsOptional()
  @IsNumberString()
  skip?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  minScore?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  maxScore?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  type?: string[];
}
