import { BadRequestException, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { CreateBookStore, BookModel, UpdateBookStore, StatusBook } from "src/book-store/domain/model/book.model";
import { IBookRepository } from "src/book-store/domain/repository/book.repository.interface";
import { PrismaService } from "src/shared/db/postgres/prisma-manager.service";
import { PaginationDto } from "src/shared/dto/pagination.dto";
import { IFilter, IPaginatedResult } from "src/shared/interfaces/pagination.interface";
import { Prisma, book as PrismaBook } from 'generated/prisma/client'
@Injectable()
export class PrismaBookRepository implements IBookRepository {
    private readonly logger = new Logger(PrismaBookRepository.name);
    constructor(
        private readonly prisma: PrismaService,
    ) { }
    async findAll(paginationDto: PaginationDto): Promise<IPaginatedResult<BookModel>> {
        const { afterCursor, beforeCursor, search, filters } = paginationDto;

        const limit = paginationDto.limit || 10;
        const filterConditions =
            filters && filters.length > 0 ? this.buildPrismaFilter(filters) : {};

        const searchCondition: Prisma.bookWhereInput = search
            ? {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { author: { contains: search, mode: 'insensitive' } },
                ],
            }
            : {};

        let whereCondition: Prisma.bookWhereInput = {};
        let orderBy: Prisma.bookOrderByWithRelationInput[] = [
            { created_at: 'desc' },
            { id: 'desc' },
        ];

        if (afterCursor) {
            const cursorDate = await this.getCursorDate(afterCursor);
            whereCondition = {
                OR: [
                    { created_at: { lt: cursorDate } },
                    {
                        created_at: cursorDate,
                        id: { lt: afterCursor },
                    },
                ],
            };
        } else if (beforeCursor) {
            const cursorDate = await this.getCursorDate(beforeCursor);
            whereCondition = {
                OR: [
                    { created_at: { gt: cursorDate } },
                    {
                        created_at: cursorDate,
                        id: { gt: beforeCursor },
                    },
                ],
            };
            orderBy = [{ created_at: 'asc' }, { id: 'asc' }];
        }

        const hasWhereCondition = Object.keys(whereCondition).length > 0;
        const hasFilterConditions = Object.keys(filterConditions).length > 0;
        const hasSearchCondition = Object.keys(searchCondition).length > 0;

        const conditions: Prisma.bookWhereInput[] = [];
        if (hasWhereCondition) conditions.push(whereCondition);
        if (hasFilterConditions) conditions.push(filterConditions);
        if (hasSearchCondition) conditions.push(searchCondition);

        const finalWhere: Prisma.bookWhereInput | undefined =
            conditions.length > 0 ? { AND: conditions } : undefined;

        const books = await this.prisma.book.findMany({
            take: limit + 1,
            where: finalWhere,
            orderBy,
        });

        const hasNextPage = beforeCursor
            ? !!(afterCursor || beforeCursor)
            : books.length > limit;
        const hasPreviousPage = beforeCursor
            ? books.length > limit
            : !!(afterCursor || beforeCursor);

        const data =
            hasNextPage && books.length !== limit
                ? books.slice(0, -1)
                : books;

        const result: BookModel[] = data.map((record: PrismaBook) =>
            this.mapToModel(record),
        );

        const startCursor = beforeCursor
            ? data.length > 0
                ? data[data.length - 1].id
                : undefined
            : data.length > 0
                ? data[0].id
                : undefined;

        const endCursor = beforeCursor
            ? data.length > 0
                ? data[0].id
                : undefined
            : data.length > 0
                ? data[data.length - 1].id
                : undefined;

        return {
            data: result,
            pageInfo: {
                limit,
                hasNextPage,
                hasPreviousPage,
                startCursor,
                endCursor,
            },
        };



        throw new Error("Method not implemented.");
    }
    async create(dto: CreateBookStore, userId: string): Promise<{ message: string; }> {
        try {
            // 1 valida si el libro ya existe
            const exist = await this.findbyTitle(dto.title);
            if (exist) {
                throw new BadRequestException(`Book with title ${dto.title} already exists`);
            }

            // 2. mapper los datos
            const newBook = this.mapperToPrismaModel(dto)
            // 2 si no existe lo crea

            const createdBook = await this.prisma.book.create({
                data: {
                    ...newBook,
                    created_by_id: userId,
                }

            });
            return {
                message: `Book with id ${createdBook.id} created successfully`
            };
        } catch (error) {
            this.handleDBEceptions(error);
        }
    }
    update(id: string, dto: UpdateBookStore): Promise<{ message: string; }> {
        throw new Error("Method not implemented.");
    }


    async findOne(id: string): Promise<BookModel> {
        try {
            const book = await this.prisma.book.findUnique({
                where: { id },
            });
            if (!book) {
                throw new BadRequestException(`Book with id ${id} not found`);
            }
            return this.mapToModel(book);
        } catch (error) {
            this.logger.error(`Error finding book with id ${id}`, error);
            this.handleDBEceptions(error);
        }
    }

    remove(id: string): Promise<any> {
        throw new Error("Method not implemented.");
    }

    private async getCursorDate(cursor: string): Promise<Date> {
        const record = await this.prisma.book.findUnique({
            where: { id: cursor },
            select: { created_at: true },
        });
        return record?.created_at || new Date();
    }

    private async findbyTitle(title: string): Promise<BookModel | null> {
        try {

            const book = await this.prisma.book.findFirst({
                where: {
                    title
                }
            })
            if (book) {
                return {
                    id: book.id as string,
                    title: book.title,
                    autor: book.author,
                    description: book.description,
                    price: book.price,
                    published_at: book.published_at,
                    created_by_id: book.created_by_id ?? '',
                    status: book.status == 'available' ? StatusBook.AVAILABLE : StatusBook.RESERVED

                }
            }
            return null;
        } catch (error) {
            this.logger.error('Error finding book by title', error);
            throw new InternalServerErrorException('Unexpected error, check server log');
        }

    }
    private handleDBEceptions(error: any): never {
        console.log(error)
        if (error.code === 11000) {
            throw new BadRequestException(error.errorResponse.errmsg);
        }
        this.logger.error(error);
        throw new InternalServerErrorException(
            'Unexpected error, check server log',
        );
    }

    // Mapear del model de dominio al model de Prisma
    private mapperToPrismaModel(book: CreateBookStore) {
        return {
            title: book.title,
            author: book.autor,
            description: book.description,
            price: book.price,
            published_at: book.published_at,
            status: book.status === StatusBook.AVAILABLE ? 'available' as const : 'reserved' as const,
        };
    }

    private buildPrismaFilter(filters: IFilter[] = []): Prisma.bookWhereInput {
        const prismaFilters: Record<
            string,
            | Prisma.StringFilter
            | Prisma.StringNullableFilter
            | Record<string, unknown>
        > = {};

        const filterSelection: Record<
            string,
            (field: string, value: string) => void
        > = {
            contains: (field, value) => {
                prismaFilters[field] = { contains: value, mode: 'insensitive' };
            },
            in: (field, value) => {
                prismaFilters[field] = {
                    in: Array.isArray(value) ? value : [value],
                };
            },
            gt: (field, value) => {
                prismaFilters[field] = { gt: value };
            },
            lt: (field, value) => {
                prismaFilters[field] = { lt: value };
            },
            df: (field, value) => {
                prismaFilters[field] = { equals: value };
            },
        };

        for (const element of filters) {
            const { field, Value } = element;
            const operator = element.operator ?? 'df';
            const handler = filterSelection[operator] ?? filterSelection['df'];
            handler(field, Value);
        }

        return prismaFilters as Prisma.bookWhereInput;
    }

    private mapToModel(record: PrismaBook): BookModel {
        return {
            id: record.id,
            title: record.title,
            autor: record.author,
            description: record.description,
            price: record.price,
            published_at: record.published_at,
            created_by_id: record.created_by_id ?? '',
            status: record.status === 'available' ? StatusBook.AVAILABLE : StatusBook.RESERVED,
        };
    }
}