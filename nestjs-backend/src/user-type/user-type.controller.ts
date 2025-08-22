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
import { UserTypesService } from './user-type.service';
import { CreateUserTypesDto } from './dto/create-user-type.dto';
import { UpdateUserTypesDto } from './dto/update-user-type.dto';

@Controller('user-types')
export class UserTypesController {
  constructor(private readonly UserTypeService: UserTypesService) {}

  @Post()
  @ResponseMessage('Create new UserType')
  create(@Body() createUserTypeDto: CreateUserTypesDto) {
    return this.UserTypeService.create(createUserTypeDto);
  }

  @Public()
  @Get()
  @ResponseMessage('Find All')
  findAll(
    @Query('current') current: number,
    @Query('pageSize') pageSize: number,
    @Query() qs: string,
  ) {
    return this.UserTypeService.findAll(+current, +pageSize, qs);
  }

  @Public()
  @Get(':id')
  @ResponseMessage('Find by id')
  findById(@Param('id') id: string) {
    return this.UserTypeService.findById(id);
  }

  @Patch(':id')
  @ResponseMessage('Update by id')
  update(
    @Param('id') id: string,
    @Body() updateUserTypeDto: UpdateUserTypesDto,
    @User() user: IUser,
  ) {
    return this.UserTypeService.update(id, updateUserTypeDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete by id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.UserTypeService.remove(id, user);
  }
}
