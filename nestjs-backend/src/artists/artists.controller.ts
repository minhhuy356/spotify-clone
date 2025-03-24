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

import { CreateArtistsDto } from './dto/create-artists.dto';

import { Public, ResponseMessage, User } from '@/decorator/customize';
import { IUser } from '@/users/users.interface';
import { ArtistsService } from './artists.service';
import { UpdateArtistsDto } from './dto/update-artists.dto';

@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistService: ArtistsService) {}

  @Post()
  @ResponseMessage('Create new Artist')
  create(@Body() createArtistDto: CreateArtistsDto, @User() user: IUser) {
    return this.artistService.create(createArtistDto, user);
  }

  @Public()
  @Get()
  @ResponseMessage('Find All')
  findAll(
    @Query('current') current: number,
    @Query('pageSize') pageSize: number,
    @Query() qs: string,
  ) {
    return this.artistService.findAll(+current, +pageSize, qs);
  }

  @Public()
  @Get(':id')
  @ResponseMessage('Find by id')
  findById(@Param('id') id: string) {
    return this.artistService.findById(id);
  }

  @Patch(':id')
  @ResponseMessage('Update by id')
  update(
    @Param('id') id: string,
    @Body() updateArtistDto: UpdateArtistsDto,
    @User() user: IUser,
  ) {
    return this.artistService.update(id, updateArtistDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete by id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.artistService.remove(id, user);
  }
}
