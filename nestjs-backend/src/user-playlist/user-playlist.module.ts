import { Module } from '@nestjs/common';

import { UserPlaylistsController } from './user-playlist.controller';
import { UserPlaylistsService } from './user-playlist.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserPlaylist,
  UserPlaylistSchema,
} from './schemas/user-playlist.schema';
import { UserActivitysModule } from '@/user_activity/user-activity.module';

@Module({
  imports: [
    UserActivitysModule,
    MongooseModule.forFeature([
      { name: UserPlaylist.name, schema: UserPlaylistSchema },
    ]),
  ],
  controllers: [UserPlaylistsController],
  providers: [UserPlaylistsService],
  exports: [UserPlaylistsService],
})
export class UserPlaylistsModule {}
