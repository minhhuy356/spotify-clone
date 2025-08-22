import { IsObjectId } from '@/decorator/is-object-id';
import { IsString } from 'class-validator';

export class CreateMonthlyListenersDto {
  @IsObjectId()
  artist: string;

  @IsString()
  listenersCount: string;
}
