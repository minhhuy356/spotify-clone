import { Module } from '@nestjs/common';

import { UserDailyFetchedTracksController } from './user-daily-fetched-tracks.controller';
import { UserDailyFetchedTracksService } from './user-daily-fetched-tracks.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserDailyFetchedTrack,
  UserDailyFetchedTrackSchema,
} from './schemas/user-daily-fetched-track.schema';
import { UserActivitysModule } from '@/user_activity/user-activity.module';
import { TracksModule } from '@/tracks/tracks.module';
import { TrackArtistsModule } from '@/track-artist/track-artist.module';

@Module({
  imports: [
    UserActivitysModule,
    TrackArtistsModule,
    MongooseModule.forFeature([
      { name: UserDailyFetchedTrack.name, schema: UserDailyFetchedTrackSchema },
    ]),
  ],
  controllers: [UserDailyFetchedTracksController],
  providers: [UserDailyFetchedTracksService],
  exports: [UserDailyFetchedTracksService],
})
export class UserDailyFetchedTracksModule {}
