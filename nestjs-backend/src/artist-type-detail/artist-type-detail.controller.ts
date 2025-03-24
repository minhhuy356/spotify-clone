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
import { ArtistTypeDetailsService } from './artist-type-detail.service';
import { CreateArtistTypeDetailsDto } from './dto/create-artist-type-detail.dto';
import { UpdateArtistTypeDetailsDto } from './dto/update-artist-type-detail.dto';

@Controller('artist-type-detail')
export class ArtistTypeDetailsController {
  constructor(
    private readonly ArtistTypeDetailService: ArtistTypeDetailsService,
  ) {}

  @Post()
  @ResponseMessage('Create new ArtistTypeDetail')
  create(
    @Body() createArtistTypeDetailDto: CreateArtistTypeDetailsDto,
    @User() user: IUser,
  ) {
    return this.ArtistTypeDetailService.create(createArtistTypeDetailDto, user);
  }

  @Public()
  @Get()
  @ResponseMessage('Find All')
  findAll(
    @Query('current') current: number,
    @Query('pageSize') pageSize: number,
    @Query() qs: string,
  ) {
    return this.ArtistTypeDetailService.findAll(+current, +pageSize, qs);
  }

  @Public()
  @Get(':id')
  @ResponseMessage('Find by id')
  findById(@Param('id') id: string) {
    return this.ArtistTypeDetailService.findById(id);
  }

  @Patch(':id')
  @ResponseMessage('Update by id')
  update(
    @Param('id') id: string,
    @Body() updateArtistTypeDetailDto: UpdateArtistTypeDetailsDto,
    @User() user: IUser,
  ) {
    return this.ArtistTypeDetailService.update(
      id,
      updateArtistTypeDetailDto,
      user,
    );
  }

  @Delete(':id')
  @ResponseMessage('Delete by id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.ArtistTypeDetailService.remove(id, user);
  }
}
