import {
  IsOptional,
  IsString,
  IsNumberString,
  IsBoolean,
  IsBooleanString,
} from 'class-validator';

export class TrackQueryDto {
  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}
