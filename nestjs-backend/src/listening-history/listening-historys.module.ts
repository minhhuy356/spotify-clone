import { Module } from '@nestjs/common';

import { ListeningHistorysController } from './listening-historys.controller';
import { ListeningHistorysService } from './listening-historys.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ListeningHistory,
  ListeningHistorySchema,
} from './schemas/listening-history.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ListeningHistory.name, schema: ListeningHistorySchema },
    ]),
  ],
  controllers: [ListeningHistorysController],
  providers: [ListeningHistorysService],
  exports: [ListeningHistorysService],
})
export class ListeningHistorysModule {}
