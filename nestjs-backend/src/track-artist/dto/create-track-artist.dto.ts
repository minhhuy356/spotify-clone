import {
  IsArray,
  IsBoolean,
  IsDate,
  IsMongoId,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ObjectId } from 'mongoose';
import { CreateTracksDto } from '@/tracks/dto/create-track.dto';

class ArtistInfo {
  @IsMongoId()
  artist: ObjectId;

  @IsMongoId()
  artistTypeDetail: ObjectId;

  @IsBoolean()
  useStageName: boolean;
}

export class CreateTrackArtistsDto {
  @ValidateNested({ each: true })
  @Type(() => CreateTracksDto)
  track: CreateTracksDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ArtistInfo)
  artists: ArtistInfo[];
}
