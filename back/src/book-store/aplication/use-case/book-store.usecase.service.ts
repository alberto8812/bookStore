import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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
  async create(dto: CreateBookStoreDto, userId: string): Promise<{ message: string; }> {
    await this.cacheService.deleteByPattern(`${BOOK_CACHE_KEYS.PATTERN_ALL}`);
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
  async update(id: string, dto: UpdateBookStoreDto): Promise<{ message: string; }> {

    const book = await this.bookRepository.findOne(id);
    if (!book) {
      throw new NotFoundException(`Character with id ${id} not found`);
    }
    await this.cacheService.deleteByPattern(`${BOOK_CACHE_KEYS.PATTERN_ALL}`);
    return this.bookRepository.update(id, dto);
  }
  async remove(id: string): Promise<{ message: string; }> {
    const book = await this.bookRepository.findOne(id);
    if (!book) {
      throw new NotFoundException(`Character with id ${id} not found`);
    }
    await this.cacheService.deleteByPattern(`${BOOK_CACHE_KEYS.PATTERN_ALL}`);
    return this.bookRepository.remove(id);
  }

}
