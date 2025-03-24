import { Module } from '@nestjs/common';
import { ArtistsModule } from '@/artists/artists.module';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { TracksModule } from '@/tracks/tracks.module';
import { Track, TrackSchema } from '@/tracks/schemas/track.schemas';
import { Artist, ArtistSchema } from '@/artists/schemas/artist.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Track.name, schema: TrackSchema }, // Đảm bảo đăng ký TrackModel
      { name: Artist.name, schema: ArtistSchema },
    ]),
  ],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
