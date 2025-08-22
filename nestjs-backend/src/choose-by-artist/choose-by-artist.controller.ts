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

import { CreateChooseByArtistsDto } from './dto/create-choose-by-artist.dto';

import { Public, ResponseMessage, User } from '@/decorator/customize';
import { IUser } from '@/users/users.interface';
import { ChooseByArtistsService } from './choose-by-artist.service';
import { UpdateChooseByArtistsDto } from './dto/update-choose-by-artist.dto';

@Controller('choose-by-artist')
export class ChooseByArtistsController {
  constructor(private readonly ChooseByArtistService: ChooseByArtistsService) {}

  @Post()
  @ResponseMessage('Create new ChooseByArtist')
  create(
    @Body() createChooseByArtistDto: CreateChooseByArtistsDto,
    @User() user: IUser,
  ) {
    return this.ChooseByArtistService.create(createChooseByArtistDto, user);
  }

  @Public()
  @Get()
  @ResponseMessage('Find All')
  findAll(
    @Query('current') current: number,
    @Query('pageSize') pageSize: number,
    @Query() qs: string,
  ) {
    return this.ChooseByArtistService.findAll(+current, +pageSize, qs);
  }

  @Public()
  @Get(':id')
  @ResponseMessage('Find by id')
  findById(@Param('id') id: string) {
    return this.ChooseByArtistService.findById(id);
  }

  @Patch(':id')
  @ResponseMessage('Update by id')
  update(
    @Param('id') id: string,
    @Body() updateChooseByArtistDto: UpdateChooseByArtistsDto,
    @User() user: IUser,
  ) {
    return this.ChooseByArtistService.update(id, updateChooseByArtistDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete by id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.ChooseByArtistService.remove(id, user);
  }
}
