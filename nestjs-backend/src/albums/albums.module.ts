import { Module } from '@nestjs/common';

import { AlbumsController } from './Albums.controller';
import { AlbumsService } from './Albums.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Album, AlbumSchema } from './schemas/Album.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Album.name, schema: AlbumSchema }]),
  ],
  controllers: [AlbumsController],
  providers: [AlbumsService],
  exports: [AlbumsService],
})
export class AlbumsModule {}
