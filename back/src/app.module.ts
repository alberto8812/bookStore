import { Module } from '@nestjs/common';

import { BookStoreModule } from './book-store/book-store.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './shared/db/postgres/postgres.module';

@Module({
  imports: [BookStoreModule, AuthModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
