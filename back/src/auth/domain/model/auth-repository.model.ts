export interface AuthRepositoryModel {
    id: string;
    email: string;
    password: string;
    name: string;
}

export type CreateAuthModel = Omit<AuthRepositoryModel, 'id'>;
export type AuthWithoutPassword = Omit<AuthRepositoryModel, 'password'>;

export type authLoginModel = Omit<AuthRepositoryModel, 'name' | 'id'>;

