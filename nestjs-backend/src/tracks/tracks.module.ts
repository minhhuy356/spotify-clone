import { Module } from '@nestjs/common';

import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Track, TrackSchema } from './schemas/track.schemas';

import { ArtistsModule } from '@/artists/artists.module';

import { GenresModule } from '@/genres/genres.module';
import { TrackPlaysService } from '@/track-plays/track-plays.service';
import { TrackPlaysModule } from '@/track-plays/track-plays.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Track.name, schema: TrackSchema }]),
    ArtistsModule,
    GenresModule,
    TrackPlaysModule,
  ],
  controllers: [TracksController],
  providers: [TracksService],
  exports: [TracksService],
})
export class TracksModule {}
