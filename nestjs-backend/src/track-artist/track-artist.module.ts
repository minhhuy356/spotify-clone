import { Module, forwardRef } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from '@/users/users.module';
import { ArtistsModule } from '@/artists/artists.module';
import { GenresModule } from '@/genres/genres.module';
import { TrackArtist, TrackArtistSchema } from './schemas/track-artist.schema';
import { TrackArtistsController } from './track-artist.controller';
import { TrackArtistsService } from './track-artist.service';
import { TracksModule } from '@/tracks/tracks.module';
import { UserTypesModule } from '@/user-type/user-type.module';
import { TagsModule } from '@/tag/tag.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TrackArtist.name, schema: TrackArtistSchema },
    ]),
    ArtistsModule,
    UserTypesModule,
    GenresModule,
    TracksModule,
  ],
  controllers: [TrackArtistsController],
  providers: [TrackArtistsService],
  exports: [TrackArtistsService],
})
export class TrackArtistsModule {}
