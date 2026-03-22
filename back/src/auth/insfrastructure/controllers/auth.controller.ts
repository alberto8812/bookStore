import { Controller, Body, Inject } from '@nestjs/common';
import { CreateUserDto } from 'src/auth/aplication/dto/create-auth.dto';
import { LoginUserDto } from 'src/auth/aplication/dto/login-user.dto';
import { Auth_USE_CASE, IAuthUseCase } from 'src/auth/aplication/interfaces/auth-use-case.interface';
import { Endpoint } from 'src/shared/decorator/endpoint.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(Auth_USE_CASE)
    private readonly authService: IAuthUseCase
  ) { }

  @Endpoint({
    method: 'POST',
    summary: 'Create a new auth record',
    route: '',
    responses: [{ status: 201, description: 'The created record', type: Object }],
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Endpoint({
    method: 'POST',
    summary: 'Login user',
    route: 'login',
    responses: [{ status: 200, description: 'User logged in', type: Object }],
  })
  loginUser(@Body() loginDto: LoginUserDto) {
    return this.authService.login(loginDto);
  }


}
