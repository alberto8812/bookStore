import { AuthRepositoryModel, CreateAuthModel } from "../model/auth-repository.model";


export const AUTH_REPOSITORY = Symbol('AuthRepository');

export interface IAuthRepository {
    create(createUserDto: CreateAuthModel): Promise<any>;
    findByEmail(email: string): Promise<any>;
}