import { Inject, Injectable } from '@nestjs/common';
import { CreateBookStoreDto } from '../dto/create-book-store.dto';
import { UpdateBookStoreDto } from '../dto/update-book-store.dto';
import { IBookUseCase } from '../interfaces/book-use-case.interface';
import { BookModel } from 'src/book-store/domain/model/book.model';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { IPaginatedResult } from 'src/shared/interfaces/pagination.interface';
import { BOOK_REPOSITORY, IBookRepository } from 'src/book-store/domain/repository/book.repository.interface';
import { RedisCacheService } from 'src/shared/db/redis/redis-cache.service';
import { BOOK_CACHE_KEYS } from 'src/shared/db/redis/constants/cache-keys';

@Injectable()
export class BookStoreusecaseService implements IBookUseCase {
  constructor(
    @Inject(BOOK_REPOSITORY) private readonly bookRepository: IBookRepository,
    private readonly cacheService: RedisCacheService,
  ) {

  }
  create(dto: CreateBookStoreDto, userId: string): Promise<{ message: string; }> {
    return this.bookRepository.create(dto, userId);
  }
  async findAll(paginationDto: PaginationDto): Promise<IPaginatedResult<BookModel>> {
    const cached = await this.cacheService.get<BookModel[]>(`${BOOK_CACHE_KEYS.FIND_ALL}_${JSON.stringify(paginationDto)}`);
    if (cached) {
      return cached as unknown as IPaginatedResult<BookModel>
    }
    const books = await this.bookRepository.findAll(paginationDto);
    await this.cacheService.set(`${BOOK_CACHE_KEYS.FIND_ALL}_${JSON.stringify(paginationDto)}`, books);
    return books;
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
