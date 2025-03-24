import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserType, UserTypeSchema } from './schemas/user-type.schema';
import { UserTypesController } from './user-type.controller';
import { UserTypesService } from './user-type.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserType.name, schema: UserTypeSchema },
    ]),
  ],
  controllers: [UserTypesController],
  providers: [UserTypesService],
  exports: [UserTypesService],
})
export class UserTypesModule {}
