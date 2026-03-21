import { Module } from '@nestjs/common';

import { BookStoreModule } from './book-store/book-store.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [BookStoreModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
