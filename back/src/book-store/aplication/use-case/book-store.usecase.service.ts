import { Inject, Injectable } from '@nestjs/common';
import { CreateBookStoreDto } from '../dto/create-book-store.dto';
import { UpdateBookStoreDto } from '../dto/update-book-store.dto';
import { IBookUseCase } from '../interfaces/book-use-case.interface';
import { BookModel } from 'src/book-store/domain/model/book.model';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { IPaginatedResult } from 'src/shared/interfaces/pagination.interface';
import { BOOK_REPOSITORY, IBookRepository } from 'src/book-store/domain/repository/book.repository.interface';

@Injectable()
export class BookStoreusecaseService implements IBookUseCase {
  constructor(
    @Inject(BOOK_REPOSITORY) private readonly bookRepository: IBookRepository
  ) {

  }
  create(dto: CreateBookStoreDto): Promise<{ message: string; }> {
    return this.bookRepository.create(dto);
  }
  findAll(paginationDto: PaginationDto): Promise<IPaginatedResult<BookModel>> {
    return this.bookRepository.findAll(paginationDto);
  }
  findOne(id: string): Promise<BookModel | null> {
    return this.bookRepository.findOne(id);
  }
  update(id: string, dto: UpdateBookStoreDto): Promise<{ message: string; }> {
    return this.bookRepository.update(id, dto);
  }
  remove(id: string): Promise<{ message: string; }> {
    return this.bookRepository.remove(id);
  }

}
