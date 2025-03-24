import { IsString } from 'class-validator';

export class CreateRolesDto {
  @IsString({ message: 'Name must be a string' })
  name: string;
}
