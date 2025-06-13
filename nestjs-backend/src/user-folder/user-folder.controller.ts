import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { Public, ResponseMessage, User } from '@/decorator/customize';
import { IUser } from '@/users/users.interface';
import { UserFoldersService } from './user-folder.service';
import { UpdateUserFoldersDto } from './dto/update-user-folder.dto';
import { CreateUserFoldersDto } from './dto/create-user-folder.dto';

@Controller('user-folder')
export class UserFoldersController {
  constructor(private readonly UserFolderService: UserFoldersService) {}

  @Post()
  @ResponseMessage('Create new UserFolder')
  create(
    @Body() createUserFolderDto: CreateUserFoldersDto,
    @User() user: IUser,
  ) {
    return this.UserFolderService.create(createUserFolderDto, user);
  }

  @Public()
  @Get()
  @ResponseMessage('Find All')
  findAll(
    @Query('current') current: number,
    @Query('pageSize') pageSize: number,
    @Query() qs: string,
  ) {
    return this.UserFolderService.findAll(+current, +pageSize, qs);
  }

  @Public()
  @Get(':id')
  @ResponseMessage('Find by id')
  findById(@Param('id') id: string) {
    return this.UserFolderService.findById(id);
  }

  @Patch(':id')
  @ResponseMessage('Update by id')
  update(
    @Param('id') id: string,
    @Body() updateUserFolderDto: UpdateUserFoldersDto,
    @User() user: IUser,
  ) {
    return this.UserFolderService.update(id, updateUserFolderDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete by id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.UserFolderService.remove(id, user);
  }
}
