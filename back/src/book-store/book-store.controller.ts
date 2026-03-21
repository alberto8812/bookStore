import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BookStoreService } from './book-store.service';
import { CreateBookStoreDto } from './dto/create-book-store.dto';
import { UpdateBookStoreDto } from './dto/update-book-store.dto';
import { Endpoint } from 'src/shared/decorator/endpoint.decorator';
import { PaginationDto } from 'src/shared/dto/pagination.dto';

@Controller('book-store')
export class BookStoreController {
  constructor(private readonly bookStoreService: BookStoreService) { }

  @Post()
  create(@Body() createBookStoreDto: CreateBookStoreDto) {
    return this.bookStoreService.create(createBookStoreDto);
  }

  @Endpoint({
    method: 'POST',
    summary: 'List books with pagination',
    route: 'pagination',
    responses: [{ status: 200, description: 'Paginated list', type: Object }],
  })
  findAll(@Body() paginationDto: PaginationDto) {
    return this.bookStoreService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookStoreService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookStoreDto: UpdateBookStoreDto) {
    return this.bookStoreService.update(+id, updateBookStoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookStoreService.remove(+id);
  }
}
