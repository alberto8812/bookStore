
import { CreateUserDto } from "../dto/create-auth.dto";
import { LoginUserDto } from "../dto/login-user.dto";


export interface IAuthUseCase {
    create(createUserDto: CreateUserDto): Promise<any>;
    login(loginUserDto: LoginUserDto): Promise<any>;
}


export const Auth_USE_CASE = Symbol('AuthUseCase');