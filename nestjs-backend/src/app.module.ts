import { Module, Search } from '@nestjs/common';

import { AppService } from '@/app.service';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

import { TracksModule } from './tracks/tracks.module';
import { GenresModule } from './genres/genres.module';
import { RolesModule } from './roles/roles.module';
import { ArtistsModule } from './artists/artists.module';
import { FilesModule } from './files/files.module';
import { MailModule } from './mail/mail.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SearchModule } from './search/search.module';
import { ArtistTypeGroupsModule } from './artist-type-group/artist-type-group.module';
import { ArtistTypeDetailsModule } from './artist-type-detail/artist-type-detail.module';
import { TrackArtistsModule } from './track-artist/track-artist.module';
import { UserActivitysModule } from './user_activity/user-activity.module';
import { UserTypesModule } from './user-type/user-type.module';
import { AlbumsModule } from './albums/albums.module';
import { TrackPlaysModule } from './track-plays/track-plays.module';
import { MonthlyListenersModule } from './monthly-listeners/monthly-listeners.module';
import { ChooseByArtistsModule } from './choose-by-artist/choose-by-artist.module';
import { UserPlaylistsModule } from './user-playlist/user-playlist.module';
import { UserFolder } from './user-folder/schemas/user-folder.schema';
import { UserFoldersModule } from './user-folder/user-folder.module';
import { UserDailyFetchedTracksModule } from './user-daily-fetched-tracks/user-daily-fetched-tracks.module';
import { TagsModule } from './tag/tag.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        connectionFactory: (connection) => {
          connection.plugin(softDeletePlugin);
          return connection;
        },
      }),

      inject: [ConfigService],
    }),

    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    TracksModule,
    RolesModule,
    UserActivitysModule,
    GenresModule,
    ArtistsModule,
    FilesModule,
    MailModule,
    SearchModule,
    ArtistTypeGroupsModule,
    ArtistTypeDetailsModule,
    TrackArtistsModule,
    UserTypesModule,
    AlbumsModule,
    TrackPlaysModule,
    MonthlyListenersModule,
    ChooseByArtistsModule,
    UserPlaylistsModule,
    UserFoldersModule,
    UserDailyFetchedTracksModule,
    TagsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
