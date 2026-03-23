
import { AuthRepositoryModel, AuthWithoutPassword } from "src/auth/domain/model/auth-repository.model";
import { CreateUserDto } from "../dto/create-auth.dto";
import { LoginUserDto } from "../dto/login-user.dto";


export interface IAuthUseCase {
    create(createUserDto: CreateUserDto): Promise<{ token: string, email: string, name: string }>;
    login(loginUserDto: LoginUserDto): Promise<{ token: string, user: AuthWithoutPassword }>;
}


export const Auth_USE_CASE = Symbol('AuthUseCase');