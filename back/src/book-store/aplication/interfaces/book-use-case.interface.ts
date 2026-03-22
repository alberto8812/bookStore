
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { CreateBookStoreDto } from '../dto/create-book-store.dto';
import { IPaginatedResult } from 'src/shared/interfaces/pagination.interface';
import { BookModel } from 'src/book-store/domain/model/book.model';
import { UpdateBookStoreDto } from '../dto/update-book-store.dto';

export interface IBookUseCase {
  create(dto: CreateBookStoreDto): Promise<{ message: string }>;
  findAll(
    paginationDto: PaginationDto,
  ): Promise<IPaginatedResult<BookModel>>;
  findOne(id: string): Promise<BookModel | null>;
  update(id: string, dto: UpdateBookStoreDto): Promise<{ message: string }>;
  remove(id: string): Promise<{ message: string }>;
}

export const BOOK_USE_CASE = Symbol('BOOK_USE_CASE');
