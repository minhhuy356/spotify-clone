import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import {
  ArtistTypeGroup,
  ArtistTypeGroupSchema,
} from './schemas/artist-type.schema';
import { ArtistTypeGroupsController } from './artist-type-group.controller';
import { ArtistTypeGroupsService } from './artist-type-group.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ArtistTypeGroup.name, schema: ArtistTypeGroupSchema },
    ]),
  ],
  controllers: [ArtistTypeGroupsController],
  providers: [ArtistTypeGroupsService],
  exports: [ArtistTypeGroupsService],
})
export class ArtistTypeGroupsModule {}
