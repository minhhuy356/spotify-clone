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
import { ArtistTypeGroupsService } from './artist-type-group.service';
import { CreateArtistTypeGroupsDto } from './dto/create-artist-type.dto';
import { UpdateArtistTypeGroupsDto } from './dto/update-artist-type.dto';

@Controller('artist-type-group')
export class ArtistTypeGroupsController {
  constructor(
    private readonly ArtistTypeGroupService: ArtistTypeGroupsService,
  ) {}

  @Post()
  @ResponseMessage('Create new ArtistTypeGroup')
  create(
    @Body() createArtistTypeGroupDto: CreateArtistTypeGroupsDto,
    @User() user: IUser,
  ) {
    return this.ArtistTypeGroupService.create(createArtistTypeGroupDto, user);
  }

  @Public()
  @Get()
  @ResponseMessage('Find All')
  findAll(
    @Query('current') current: number,
    @Query('pageSize') pageSize: number,
    @Query() qs: string,
  ) {
    return this.ArtistTypeGroupService.findAll(+current, +pageSize, qs);
  }

  @Public()
  @Get(':id')
  @ResponseMessage('Find by id')
  findById(@Param('id') id: string) {
    return this.ArtistTypeGroupService.findById(id);
  }

  @Patch(':id')
  @ResponseMessage('Update by id')
  update(
    @Param('id') id: string,
    @Body() updateArtistTypeGroupDto: UpdateArtistTypeGroupsDto,
    @User() user: IUser,
  ) {
    return this.ArtistTypeGroupService.update(
      id,
      updateArtistTypeGroupDto,
      user,
    );
  }

  @Delete(':id')
  @ResponseMessage('Delete by id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.ArtistTypeGroupService.remove(id, user);
  }
}
