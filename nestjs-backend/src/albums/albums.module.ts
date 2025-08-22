import { Module } from '@nestjs/common';

import { AlbumsController } from './Albums.controller';
import { AlbumsService } from './Albums.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Album, AlbumSchema } from './schemas/Album.schema';
import { UserActivitysModule } from '@/user_activity/user-activity.module';
import { ListeningHistorysModule } from '@/listening-history/listening-historys.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Album.name, schema: AlbumSchema }]),
  ],
  controllers: [AlbumsController],
  providers: [AlbumsService],
  exports: [AlbumsService],
})
export class AlbumsModule {}
