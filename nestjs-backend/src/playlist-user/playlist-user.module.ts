import { Module } from '@nestjs/common';

import { PlaylistUsersController } from './playlist-user.controller';
import { PlaylistUsersService } from './playlist-user.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PlaylistUser,
  PlaylistUserSchema,
} from './schemas/playlist-user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PlaylistUser.name, schema: PlaylistUserSchema },
    ]),
  ],
  controllers: [PlaylistUsersController],
  providers: [PlaylistUsersService],
  exports: [PlaylistUsersService],
})
export class PlaylistUsersModule {}
