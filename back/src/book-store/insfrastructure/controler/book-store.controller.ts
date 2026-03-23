import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { CreateBookStoreDto } from '../../aplication/dto/create-book-store.dto';
import { UpdateBookStoreDto } from '../../aplication/dto/update-book-store.dto';
import { Endpoint } from 'src/shared/decorator/endpoint.decorator';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { Auth } from 'src/auth/insfrastructure/decorator/auth.decorator';
import { BOOK_USE_CASE, IBookUseCase } from 'src/book-store/aplication/interfaces/book-use-case.interface';
import { GetUser } from 'src/auth/insfrastructure/decorator/get-user.decorator';
import { AuthRepositoryModel } from 'src/auth/domain/model/auth-repository.model';

@Controller('book-store')
export class BookStoreController {
  constructor(
    @Inject(BOOK_USE_CASE) private readonly bookStoreService: IBookUseCase
  ) { }

  @Auth()
  @Endpoint({
    method: 'POST',
    summary: 'Create a new book',
    route: '',
    responses: [{ status: 201, description: 'The book has been successfully created.', type: Object }],
  })
  create(@Body() createBookStoreDto: CreateBookStoreDto, @GetUser() user: AuthRepositoryModel) {
    const userId = user.id;
    console.log('Creating book with data:', createBookStoreDto, 'for user ID:', userId);
    return this.bookStoreService.create(createBookStoreDto, userId);
  }

  @Endpoint({
    method: 'POST',
    summary: 'List books with pagination',
    route: 'pagination',
    responses: [{ status: 200, description: 'Paginated list', type: Object }],
  })
  findAll(@Body() paginationDto: PaginationDto) {
    return this.bookStoreService.findAll(paginationDto);
  }

  @Endpoint({
    method: 'GET',
    summary: 'Get a book by ID',
    route: ':id',
    responses: [{ status: 200, description: 'The found record', type: Object }],
  })
  findOne(@Param('id') id: string) {
    return this.bookStoreService.findOne(id);
  }

  @Auth()
  @Endpoint({
    method: 'PATCH',
    summary: 'Update a book by ID',
    route: ':id',
    responses: [{ status: 200, description: 'The updated record', type: Object }],
  })
  update(@Param('id') id: string, @Body() updateBookStoreDto: UpdateBookStoreDto) {
    return this.bookStoreService.update(id, updateBookStoreDto);
  }

  @Auth()
  @Endpoint({
    method: 'DELETE',
    summary: 'Delete a book by ID',
    route: ':id',
    responses: [{
      status: 200, description: 'The record has been successfully deleted.',
      type: Object
    }],
  })
  remove(@Param('id') id: string) {
    return this.bookStoreService.remove(id);
  }
}
