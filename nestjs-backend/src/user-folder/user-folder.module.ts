import { Module } from '@nestjs/common';

import { UserFoldersController } from './user-folder.controller';
import { UserFoldersService } from './user-folder.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserFolder, UserFolderSchema } from './schemas/user-folder.schema';
import { UserActivitysModule } from '@/user_activity/user-activity.module';

@Module({
  imports: [
    UserActivitysModule,
    MongooseModule.forFeature([
      { name: UserFolder.name, schema: UserFolderSchema },
    ]),
  ],
  controllers: [UserFoldersController],
  providers: [UserFoldersService],
  exports: [UserFoldersService],
})
export class UserFoldersModule {}
