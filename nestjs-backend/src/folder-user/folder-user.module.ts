import { Module } from '@nestjs/common';

import { FolderUsersController } from './folder-user.controller';
import { FolderUsersService } from './folder-user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FolderUser, FolderUserSchema } from './schemas/folder-user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FolderUser.name, schema: FolderUserSchema },
    ]),
  ],
  controllers: [FolderUsersController],
  providers: [FolderUsersService],
  exports: [FolderUsersService],
})
export class FolderUsersModule {}
