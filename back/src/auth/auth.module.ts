import { Module } from '@nestjs/common';
import { AuthService } from './aplication/use-cases/auth.service';
import { AuthController } from './insfrastructure/controllers/auth.controller';
import { AUTH_REPOSITORY } from './domain/repository/auth.repository.interface';
import { PrismaAuthRepository } from './insfrastructure/repositories/prisma-aut.repository';
import { Auth_USE_CASE } from './aplication/interfaces/auth-use-case.interface';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envs } from 'src/config/envs';
import { JwtStrategy } from './insfrastructure/strategy/jwt.strategy';

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
    },
    JwtStrategy

  ],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configServeice: ConfigService) => {
        return {
          secret: envs.jwtSecret, // defenimos la variable entorno
          signOptions: {
            expiresIn: '2h',
          },
        };
      },
    }),
  ],
  exports: [AuthModule, JwtStrategy, PassportModule, JwtModule]
})
export class AuthModule { }
