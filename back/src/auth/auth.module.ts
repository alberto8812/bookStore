import { Module } from '@nestjs/common';
import { AuthService } from './aplication/use-cases/auth.service';
import { AuthController } from './insfrastructure/controllers/auth.controller';
import { AUTH_REPOSITORY } from './domain/repository/auth.repository.interface';
import { PrismaAuthRepository } from './insfrastructure/repositories/prisma-aut.repository';
import { Auth_USE_CASE } from './aplication/interfaces/auth-use-case.interface';


@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: AUTH_REPOSITORY,
      useClass: PrismaAuthRepository
    },
    {
      provide: Auth_USE_CASE,
      useClass: AuthService
    }
  ],
})
export class AuthModule { }
