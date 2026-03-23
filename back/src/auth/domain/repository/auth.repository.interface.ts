import { authLoginModel, AuthRepositoryModel, AuthWithoutPassword, CreateAuthModel } from "../model/auth-repository.model";


export const AUTH_REPOSITORY = Symbol('AuthRepository');

export interface IAuthRepository {
    create(createUserDto: CreateAuthModel): Promise<{ token: string, email: string, name: string }>;
    findByEmail(email: string): Promise<AuthRepositoryModel | null>;
    login(loginUserDto: authLoginModel): Promise<{ token: string, user: AuthWithoutPassword }>;
}