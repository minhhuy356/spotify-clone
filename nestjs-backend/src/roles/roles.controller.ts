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
import { RolesService } from './Roles.service';
import { UpdateRolesDto } from './dto/update-role.dto';
import { CreateRolesDto } from './dto/create-role.dto';

@Controller('Roles')
export class RolesController {
  constructor(private readonly roleService: RolesService) {}

  @Post()
  @ResponseMessage('Create new Role')
  create(@Body() createRoleDto: CreateRolesDto) {
    return this.roleService.create(createRoleDto);
  }

  @Public()
  @Get()
  @ResponseMessage('Find All')
  findAll(
    @Query('current') current: number,
    @Query('pageSize') pageSize: number,
    @Query() qs: string,
  ) {
    return this.roleService.findAll(+current, +pageSize, qs);
  }

  @Public()
  @Get(':id')
  @ResponseMessage('Find by id')
  findById(@Param('id') id: string) {
    return this.roleService.findById(id);
  }

  @Patch(':id')
  @ResponseMessage('Update by id')
  update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRolesDto,
    @User() user: IUser,
  ) {
    return this.roleService.update(id, updateRoleDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete by id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.roleService.remove(id, user);
  }
}
