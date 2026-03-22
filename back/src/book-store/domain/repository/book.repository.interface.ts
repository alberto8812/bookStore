import { PaginationDto } from "src/shared/dto/pagination.dto";
import { BookModel, CreateBookStore, UpdateBookStore } from "../model/book.model";
import { IPaginatedResult } from "src/shared/interfaces/pagination.interface";


export interface IBookRepository {
    create(dto: CreateBookStore): Promise<{ message: string }>;
    findAll(
        paginationDto: PaginationDto,
    ): Promise<IPaginatedResult<BookModel>>;
    findOne(id: string): Promise<BookModel | null>;
    update(id: string, dto: UpdateBookStore): Promise<{ message: string }>;
    remove(id: string): Promise<{ message: string }>;
}

export const BOOK_REPOSITORY = Symbol('BookRepository');