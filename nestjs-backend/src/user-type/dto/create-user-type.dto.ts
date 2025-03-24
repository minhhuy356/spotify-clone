import { IsString, IsOptional } from 'class-validator';

export class CreateUserTypesDto {
  @IsString()
  @IsOptional()
  name?: string;
}
