import { Module } from '@nestjs/common';
import { BookStoreController } from './insfrastructure/controler/book-store.controller';
import { AuthModule } from 'src/auth/auth.module';
import { BookStoreusecaseService } from './aplication/use-case/book-store.usecase.service';
import { PrismaBookRepository } from './insfrastructure/repositories/prisma-book.repository';
import { BOOK_REPOSITORY } from './domain/repository/book.repository.interface';
import { BOOK_USE_CASE } from './aplication/interfaces/book-use-case.interface';

@Module({
  controllers: [BookStoreController],
  providers: [
    {
      provide: BOOK_USE_CASE,
      useClass: BookStoreusecaseService
    },
    {
      provide: BOOK_REPOSITORY,
      useClass: PrismaBookRepository
    }
  ],
  imports: [
    AuthModule,
  ],
})
export class BookStoreModule { }
