import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { Public, ResponseMessage } from '@/decorator/customize';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Public()
  @Get()
  @ResponseMessage('Search')
  async search(@Query('q') query: string) {
    return this.searchService.search(query);
  }
}
