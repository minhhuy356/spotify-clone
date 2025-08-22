import { Module } from '@nestjs/common';

import { ChooseByArtistsController } from './choose-by-artist.controller';
import { ChooseByArtistsService } from './choose-by-artist.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ChooseByArtist,
  ChooseByArtistSchema,
} from './schemas/choose-by-artist.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChooseByArtist.name, schema: ChooseByArtistSchema },
    ]),
  ],
  controllers: [ChooseByArtistsController],
  providers: [ChooseByArtistsService],
  exports: [ChooseByArtistsService],
})
export class ChooseByArtistsModule {}
