import { IsString } from 'class-validator';

export class CreateTagsDto {
  @IsString({ message: 'Name must be a string' })
  name: string;
}
