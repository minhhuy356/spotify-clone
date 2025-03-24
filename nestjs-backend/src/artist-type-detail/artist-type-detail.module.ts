import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import {
  ArtistTypeDetail,
  ArtistTypeDetailSchema,
} from './schemas/artist-type-detail.schema';
import { ArtistTypeDetailsController } from './artist-type-detail.controller';
import { ArtistTypeDetailsService } from './artist-type-detail.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ArtistTypeDetail.name, schema: ArtistTypeDetailSchema },
    ]),
  ],
  controllers: [ArtistTypeDetailsController],
  providers: [ArtistTypeDetailsService],
  exports: [ArtistTypeDetailsService],
})
export class ArtistTypeDetailsModule {}
