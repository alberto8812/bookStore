import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BookStoreService } from './book-store.service';
import { CreateBookStoreDto } from './dto/create-book-store.dto';
import { UpdateBookStoreDto } from './dto/update-book-store.dto';
import { Endpoint } from 'src/shared/decorator/endpoint.decorator';
import { PaginationDto } from 'src/shared/dto/pagination.dto';

@Controller('book-store')
export class BookStoreController {
  constructor(private readonly bookStoreService: BookStoreService) { }

  @Endpoint({
    method: 'POST',
    summary: 'Create a new book',
    route: '',
    responses: [{ status: 201, description: 'The book has been successfully created.', type: Object }],
  })
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

  @Endpoint({
    method: 'GET',
    summary: 'Get a book by ID',
    route: ':id',
    responses: [{ status: 200, description: 'The found record', type: Object }],
  })
  findOne(@Param('id') id: string) {
    return this.bookStoreService.findOne(+id);
  }

  @Endpoint({
    method: 'PATCH',
    summary: 'Update a book by ID',
    route: ':id',
    responses: [{ status: 200, description: 'The updated record', type: Object }],
  })
  update(@Param('id') id: string, @Body() updateBookStoreDto: UpdateBookStoreDto) {
    return this.bookStoreService.update(+id, updateBookStoreDto);
  }

  remove(@Param('id') id: string) {
    return this.bookStoreService.remove(+id);
  }
}
