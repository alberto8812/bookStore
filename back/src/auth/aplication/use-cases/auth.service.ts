import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-auth.dto';
import { IAuthUseCase } from '../interfaces/auth-use-case.interface';
import { LoginUserDto } from '../dto/login-user.dto';
import { AUTH_REPOSITORY, IAuthRepository } from 'src/auth/domain/repository/auth.repository.interface';

@Injectable()
export class AuthService implements IAuthUseCase {

  constructor(
    @Inject(AUTH_REPOSITORY) private readonly authRepository: IAuthRepository
  ) { }


  create(createUserDto: CreateUserDto): Promise<any> {
    return this.authRepository.create(createUserDto);
  }
  login(loginUserDto: LoginUserDto): Promise<any> {
    throw new Error('Method not implemented.');
  }

}
