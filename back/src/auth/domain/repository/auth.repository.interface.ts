

export const AUTH_REPOSITORY = Symbol('AuthRepository');

export interface IAuthRepository {
    create(createUserDto: any): Promise<any>;
    findByEmail(email: string): Promise<any>;
}