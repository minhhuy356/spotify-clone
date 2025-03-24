import { Module } from '@nestjs/common';

import { MonthlyListenersController } from './monthly-listeners.controller';
import { MonthlyListenersService } from './monthly-listeners.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MonthlyListener,
  MonthlyListenerSchema,
} from './schemas/monthly-listener.schema';
import { TrackPlaysModule } from '@/track-plays/track-plays.module';
import { TracksModule } from '@/tracks/tracks.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MonthlyListener.name, schema: MonthlyListenerSchema },
    ]),
    TrackPlaysModule,
  ],
  controllers: [MonthlyListenersController],
  providers: [MonthlyListenersService],
  exports: [MonthlyListenersService],
})
export class MonthlyListenersModule {}
