import { BadRequestException, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { CreateBookStore, BookModel, UpdateBookStore, StatusBook } from "src/book-store/domain/model/book.model";
import { IBookRepository } from "src/book-store/domain/repository/book.repository.interface";
import { PrismaService } from "src/shared/db/postgres/prisma-manager.service";


@Injectable()
export class PrismaBookRepository implements IBookRepository {
    private readonly logger = new Logger(PrismaBookRepository.name);
    constructor(
        private readonly prisma: PrismaService,
    ) { }
    async create(dto: CreateBookStore): Promise<{ message: string; }> {
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
                data: newBook
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

    findAll(): Promise<any> {
        throw new Error("Method not implemented.");
    }
    findOne(id: string): Promise<any> {
        throw new Error("Method not implemented.");
    }

    remove(id: string): Promise<any> {
        throw new Error("Method not implemented.");
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
            status: book.status === StatusBook.AVAILABLE ? 'available' as const : 'reserved' as const,
        };
    }
}