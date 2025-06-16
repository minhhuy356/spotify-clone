import { Module } from '@nestjs/common';

import { LyricsController } from './lyrics.controller';
import { LyricsService } from './lyrics.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Lyric, LyricSchema } from './schemas/Lyric.schema';
import { TracksModule } from '@/tracks/tracks.module';

@Module({
  imports: [
    TracksModule,
    MongooseModule.forFeature([{ name: Lyric.name, schema: LyricSchema }]),
  ],
  controllers: [LyricsController],
  providers: [LyricsService],
  exports: [LyricsService],
})
export class LyricsModule {}
