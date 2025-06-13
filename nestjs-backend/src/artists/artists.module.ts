import { Module } from '@nestjs/common';

import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Artist, ArtistSchema } from './schemas/artist.schema';
import { TracksModule } from '@/tracks/tracks.module';
import { ChooseByArtistsModule } from '@/choose-by-artist/choose-by-artist.module';

@Module({
  imports: [
    ChooseByArtistsModule,
    MongooseModule.forFeature([{ name: Artist.name, schema: ArtistSchema }]),
  ],
  controllers: [ArtistsController],
  providers: [ArtistsService],
  exports: [ArtistsService],
})
export class ArtistsModule {}
