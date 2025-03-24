import { IsString } from 'class-validator';

export class CreateGenresDto {
  @IsString({ message: 'Name must be a string' })
  name: string;
}
