import { Module } from '@nestjs/common';

import { TrackPlaysController } from './track-plays.controller';
import { TrackPlaysService } from './track-plays.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TrackPlay, TrackPlaySchema } from './schemas/track-play.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TrackPlay.name, schema: TrackPlaySchema },
    ]),
  ],
  controllers: [TrackPlaysController],
  providers: [TrackPlaysService],
  exports: [TrackPlaysService],
})
export class TrackPlaysModule {}
