import { Module } from '@nestjs/common';

import { BookStoreModule } from './book-store/book-store.module';

@Module({
  imports: [BookStoreModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
