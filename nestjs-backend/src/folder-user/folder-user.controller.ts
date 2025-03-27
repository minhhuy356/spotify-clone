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
import { FolderUsersService } from './Folder-user.service';
import { UpdateFolderUsersDto } from './dto/update-folder-user.dto';
import { CreateFolderUsersDto } from './dto/create-folder-user.dto';

@Controller('Folder-user')
export class FolderUsersController {
  constructor(private readonly FolderUserService: FolderUsersService) {}

  @Post()
  @ResponseMessage('Create new FolderUser')
  create(@Body() createFolderUserDto: CreateFolderUsersDto) {
    return this.FolderUserService.create(createFolderUserDto);
  }

  @Public()
  @Get()
  @ResponseMessage('Find All')
  findAll(
    @Query('current') current: number,
    @Query('pageSize') pageSize: number,
    @Query() qs: string,
  ) {
    return this.FolderUserService.findAll(+current, +pageSize, qs);
  }

  @Public()
  @Get(':id')
  @ResponseMessage('Find by id')
  findById(@Param('id') id: string) {
    return this.FolderUserService.findById(id);
  }

  @Patch(':id')
  @ResponseMessage('Update by id')
  update(
    @Param('id') id: string,
    @Body() updateFolderUserDto: UpdateFolderUsersDto,
    @User() user: IUser,
  ) {
    return this.FolderUserService.update(id, updateFolderUserDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete by id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.FolderUserService.remove(id, user);
  }
}
