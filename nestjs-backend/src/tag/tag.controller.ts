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
import { TagsService } from './tag.service';
import { UpdateTagsDto } from './dto/update-tag.dto';
import { CreateTagsDto } from './dto/create-tag.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly TagService: TagsService) {}

  @Post()
  @ResponseMessage('Create new Tag')
  create(@Body() createTagDto: CreateTagsDto) {
    return this.TagService.create(createTagDto);
  }

  @Public()
  @Get()
  @ResponseMessage('Find All')
  findAll(
    @Query('current') current: number,
    @Query('pageSize') pageSize: number,
    @Query() qs: string,
  ) {
    return this.TagService.findAll(+current, +pageSize, qs);
  }

  @Public()
  @Get(':id')
  @ResponseMessage('Find by id')
  findById(@Param('id') id: string) {
    return this.TagService.findById(id);
  }

  @Patch(':id')
  @ResponseMessage('Update by id')
  update(
    @Param('id') id: string,
    @Body() updateTagDto: UpdateTagsDto,
    @User() user: IUser,
  ) {
    return this.TagService.update(id, updateTagDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete by id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.TagService.remove(id, user);
  }
}
