import { Module } from '@nestjs/common';
import { BookStoreService } from './book-store.service';
import { BookStoreController } from './book-store.controller';

@Module({
  controllers: [BookStoreController],
  providers: [BookStoreService],
})
export class BookStoreModule {}
