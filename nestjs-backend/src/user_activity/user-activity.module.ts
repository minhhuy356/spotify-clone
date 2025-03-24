import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from '@/users/users.module';
import { TracksModule } from '@/tracks/tracks.module';
import { ArtistsModule } from '@/artists/artists.module';
import { UserActivitysController } from './user-activity.controller';
import { UserActivitysService } from './user-activity.service';
import {
  UserActivity,
  UserActivitySchema,
} from './schemas/user-activity.schemas';
import { AlbumsModule } from '@/albums/albums.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserActivity.name, schema: UserActivitySchema },
    ]),
    TracksModule,
    ArtistsModule,
    AlbumsModule,
  ],
  controllers: [UserActivitysController],
  providers: [UserActivitysService],
  exports: [UserActivitysService],
})
export class UserActivitysModule {}
