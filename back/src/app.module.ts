import { Module } from '@nestjs/common';

import { BookStoreModule } from './book-store/book-store.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './shared/db/postgres/postgres.module';
import { CacheModule } from './shared/db/redis/cache.module';

@Module({
  imports: [BookStoreModule, AuthModule, DatabaseModule, CacheModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
