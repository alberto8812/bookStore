import { Module } from '@nestjs/common';
import { BookStoreController } from './insfrastructure/controler/book-store.controller';
import { AuthModule } from 'src/auth/auth.module';
import { BookStoreusecaseService } from './aplication/use-case/book-store.usecase.service';
import { BOOK_USE_CASE } from 'dist/src/book-store/aplication/interfaces/book-use-case.interface';

@Module({
  controllers: [BookStoreController],
  providers: [
    {
      provide: BOOK_USE_CASE,
      useClass: BookStoreusecaseService
    }
  ],
  imports: [
    AuthModule,
  ],
})
export class BookStoreModule { }
